package com.yimiyisu.kooteam.hooks.project;

import com.google.gson.JsonObject;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;
import com.zen.kit.StringKit;

@ZenHook("put/project")
public class PutProjectHook implements IHook {
    @Inject
    private ZenEngine zenEngine;

    @Override
    public ZenResult before(ZenData data) {
        String templateId = data.get("templateId");
        if (StringKit.isEmpty(templateId)) return ZenResult.fail("项目模板不能为空");
        JsonObject templateData = zenEngine.get("project_template", templateId);

        if (templateData == null) return ZenResult.fail("该模板不存在");
        data.put("fileGroup", templateData.get("fileGroup").getAsJsonArray());
        data.put("todoGroup", templateData.get("todoGroup").getAsJsonArray());
        data.put("knowledge", templateData.get("knowledge").getAsInt());
        return IHook.super.before(data);
    }

    @Override
    public void after(ZenData data, ZenResult result) {
        data.put("projectId", result.get("id")).refresh();
        data.put("userId", data.getUid());
        data.put("templateId", data.get("templateId"));
        zenEngine.execute("put/project_user", data);
    }
}
