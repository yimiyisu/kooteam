package com.yimiyisu.kooteam.hooks.thing;

import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("patch/thing")
public class PatchHook implements IHook {

    @Override
    public ZenResult before(ZenData data) {
        return IHook.super.before(data);
    }
}
