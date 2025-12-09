package com.yimiyisu.kooteam.hooks.zen;

import com.google.gson.JsonObject;
import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;
import com.zen.kit.ConfigKit;

@ZenHook("zenMenu")
public class ZenMenuHook implements IHook {
    private static final String APPS_KEY = "apps";

    @Override
    public void after(ZenData data, ZenResult result) {
        JsonObject apps = ConfigKit.self(APPS_KEY);
        if (apps != null && !apps.isEmpty()) {
            result.put(APPS_KEY, apps.getAsJsonArray(APPS_KEY));
        }
        IHook.super.after(data, result);
    }
}
