package com.yimiyisu.kooteam.hooks.role;

import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("put/role")
public class PutHook implements IHook {
    @Inject
    private ZenEngine zenEngine;

    @Override
    public void after(ZenData data, ZenResult zenResult){
        zenEngine.execute("put/role_app",ZenData.create("roleId",zenResult.get("id")));
    }
}
