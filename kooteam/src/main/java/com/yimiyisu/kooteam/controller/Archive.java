package com.yimiyisu.kooteam.controller;

import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.enums.ZenRole;
import com.zen.kit.JsonKit;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@AccessRole(ZenRole.SIGNATURE)
public class Archive extends ZenController {
    @Inject
    private ZenEngine zenEngine;

    public ZenResult delete(ZenData data) {
        return zenEngine.execute("delete/thing_archive", data);
    }

    public ZenResult put(ZenData data) {
        ZenResult thingResult = zenEngine.execute("get/thing", data);
        if (thingResult.isEmpty()) return ZenResult.fail("该待办不存在");
        ZenData archiveData = new ZenData(data);
        archiveData.put("id", thingResult.get("id"));
        archiveData.put("title", thingResult.get("title"));
        archiveData.put("content", JsonKit.stringify(thingResult.getData()));
        archiveData.put("parentId", thingResult.get("parentId"));
        archiveData.put("projectId", thingResult.get("projectId"));
        archiveData.put("uid", thingResult.get("createUid"));
        archiveData.put("owner", thingResult.get("owner"));
        archiveData.put("status", thingResult.get("status"));
        archiveData.put("quadrant", thingResult.get("quadrant"));
        zenEngine.execute("put/thing_archive", archiveData);
        return zenEngine.execute("delete/thing", data);
    }

    public ZenResult restore(ZenData data) {
        ZenResult result = zenEngine.execute("get/thing_archive", data);
        if (result.isEmpty()) {
            return ZenResult.fail("该存档不存在");
        }
        ZenData restoreData = result.getZenData("content", data);
        zenEngine.execute("put/thingByRestore", restoreData);
        return zenEngine.execute("delete/thing_archive", data);
    }
}
