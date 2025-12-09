package com.yimiyisu.kooteam.hooks.role;

import com.zen.ZenEngine;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("/get/role_app")
public class GetHook implements IHook {
    @Inject
    private ZenEngine zenEngine;

//    @Override
//    public ZenResult before(ZenData data){
//        System.out.println(data);
//        ZenResult result = zenEngine.execute("/do/list/role_app", data);
//        data.get("id",result.get("id"));
//        return IHook.super.before(data);
//    }
}
