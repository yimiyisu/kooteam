package com.yimiyisu.kooteam.controller;

import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.enums.ZenRole;

@AccessRole(ZenRole.CONSOLE)
public class Project extends ZenController {
    @Inject
    private ZenEngine zenEngine;

    public ZenResult my(ZenData data) {
        ZenResult myProject = zenEngine.execute("select/project_user", data);
        if (myProject.isEmpty()) return ZenResult.success();
        Object myData = myProject.getData();
        if (myData != null) {

        }
//        HashMap<String,Object>
        return ZenResult.success();
    }
}
