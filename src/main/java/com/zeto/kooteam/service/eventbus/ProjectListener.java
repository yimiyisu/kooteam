package com.zeto.kooteam.service.eventbus;

import com.google.common.eventbus.Subscribe;
import com.zeto.Zen;
import com.zeto.ZenCondition;
import com.zeto.ZenConditioner;
import com.zeto.ZenData;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.eventbus.model.ProjectModel;

public class ProjectListener {
    private static final String thingTable = "thing";
    private static final String executor = "patch/project";

    @Subscribe
    public void execute(ProjectModel model) {
        ZenStorageEngine storageEngine = Zen.getStorageEngine();
        ZenCondition unfinishCon = ZenConditioner.And().eq("projectId", model.getProjectId()).eq("status", 0);
        long unfinish = storageEngine.count(thingTable, unfinishCon);

        ZenCondition finishedCon = ZenConditioner.And().eq("projectId", model.getProjectId()).eq("status", 1);
        long finished = storageEngine.count(thingTable, finishedCon);
        ZenData params = ZenData.put("_id", model.getProjectId()).
                add("unfinish", unfinish + "").add("finished", finished + "");
        storageEngine.execute(executor, params, null);
    }
}
