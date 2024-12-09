package com.yimiyisu.kooteam.hooks.thing;

import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("put/thing")
public class PutThingHook implements IHook {
    @Override
    public ZenResult before(ZenData data) {
        if (data.isEmpty("owner")) {
            data.put("owner", data.getUid());
        }
        return IHook.super.before(data);
    }
}
