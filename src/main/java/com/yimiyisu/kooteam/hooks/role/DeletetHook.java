package com.yimiyisu.kooteam.hooks.role;

import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("delete/role")
public class DeletetHook implements IHook {
    @Inject
    private ZenEngine zenEngine;

    @Override
    public void after(ZenData data, ZenResult zenResult){
        zenEngine.execute("delete/role_app",ZenData.create("roleId",zenResult.get("id")));
    }
}
