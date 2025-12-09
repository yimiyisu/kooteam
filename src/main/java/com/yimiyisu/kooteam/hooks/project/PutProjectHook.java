package com.yimiyisu.kooteam.hooks.project;

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
        if (StringKit.isEmpty(templateId))
            return ZenResult.fail("项目模板不能为空");
        ZenResult templateResult = zenEngine.execute("get/project_template", ZenData.create("id", templateId));
        if (templateResult.isEmpty())
            return ZenResult.fail("该模板不存在");

        if (StringKit.isNotEmpty(templateResult.get("fileGroup")))
            data.put("fileGroup", templateResult.getObject("fileGroup"));
        if (StringKit.isNotEmpty(templateResult.get("todoGroup")))
            data.put("todoGroup", templateResult.getObject("todoGroup"));
        if (StringKit.isNotEmpty(templateResult.get("knowledge")))
            data.put("knowledge", templateResult.getObject("knowledge"));
        return IHook.super.before(data);
    }

    @Override
    public void after(ZenData data, ZenResult result) {
        data.put("projectId", result.get("id")).refresh();
        data.put("userId", data.getUid());
        data.put("templateName", data.get("templateName"));
        zenEngine.execute("put/project_user", data);
    }
}
