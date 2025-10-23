package com.yimiyisu.kooteam.hooks.project;

import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("put/project_user")
public class PutProjectUserHook implements IHook {
    @Override
    public ZenResult before(ZenData data){
        if (data.get("role") ==null ||data.get("role").isEmpty()){
            data.put("role","1");
        }
        return IHook.super.before(data);
    }
}
