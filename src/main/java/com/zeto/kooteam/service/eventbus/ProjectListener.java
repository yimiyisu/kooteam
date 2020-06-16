package com.zeto.kooteam.service.eventbus;

import com.blade.mvc.WebContext;
import com.google.common.eventbus.Subscribe;
import com.zeto.Zen;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.domain.ZenCondition;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.driver.domain.OrderType;
import com.zeto.kooteam.service.eventbus.model.NoteModel;
import com.zeto.kooteam.service.eventbus.model.ProjectModel;

public class ProjectListener {
    private static final String thingTable = "thing";
    private static final String executor = "patch/project";
    private static final ZenStorageEngine zenStorageEngine = Zen.getStorageEngine();
    private static final int maxTime = 900;

    @Subscribe
    public void execute(ProjectModel model) {
        WebContext.create(model.getSite());

        ZenCondition unfinishCon = ZenConditionKit.And().eq("projectId", model.getProjectId()).eq("status", 0).notEq("owner", "0");
        long unfinish = zenStorageEngine.count(thingTable, unfinishCon);

        ZenCondition finishedCon = ZenConditionKit.And().eq("projectId", model.getProjectId()).eq("status", 1).notEq("owner", "0");
        long finished = zenStorageEngine.count(thingTable, finishedCon);
        ZenData params = ZenData.create("_id", model.getProjectId()).
                put("unfinish", unfinish + "").put("finished", finished + "");
        zenStorageEngine.execute(executor, params, null);
        WebContext.remove();
    }

    @Subscribe
    public void note(NoteModel noteModel) {
        ZenData data = noteModel.getData();
        String noteId = data.get("_id"), contentKey = "content";
        if (data.isEmpty(contentKey)) {
            return;
        }
        try {
            WebContext.create(noteModel.getSite());
            long now = noteModel.getTime();
            ZenResult lastNote = zenStorageEngine.get("noteLog",
                    ZenConditionKit.And().
                            eq("parentId", noteId).
                            order("_id", OrderType.DESC).outputs("_id", "updateTime"));
            ZenData params = ZenData.create("updateTime", now).put(contentKey, data.get(contentKey));
            if (lastNote.isEmpty() || lastNote.getLong("updateTime") < now - maxTime) {
                params.put("parentId", noteId);
                zenStorageEngine.execute("put/noteLog", params, null);
                return;
            }
            params.put("_id", lastNote.get("_id"));
            zenStorageEngine.execute("patch/noteLog", params, null);
        } finally {
            WebContext.remove();
        }
    }
}
