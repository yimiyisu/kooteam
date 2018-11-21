package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.zeto.ZenCondition;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.annotation.MethodType;
import com.zeto.domain.ZenMethod;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;

import java.util.Map;


@AccessRole(ZenRole.TEST)
public class Test {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    private static final String adminUid = "5b7bf74398d6d207466796b2";

    @MethodType(ZenMethod.ALL)
    public ZenResult project(ZenUser user) {
        if (adminUid.equals(user.getUid())) {
            return ZenResult.fail("无操作权限");
        }
        ZenCondition condition = ZenCondition.And().eq("type", 4);
        ZenResult result = zenStorageEngine.select("note", condition, 100);
        Map<String, Object> current;
        for (Object item : result.getList()) {
            current = (Map) item;
            ZenData param = ZenData.put("uid", current.get("uid").toString())
                    .add("noteId", current.get("_id").toString())
                    .add("permission", "2");
            ZenResult count = zenStorageEngine.execute("count/noteUser", param, user);
            if (count.getLong() == 0) {
                zenStorageEngine.execute("put/noteUser", param, user);
            }
        }
        return ZenResult.success("同步完成");
    }
}
