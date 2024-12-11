package com.yimiyisu.kooteam.hooks.weekReport;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

import java.util.ArrayList;
import java.util.List;

@ZenHook("patch/weekSend")
public class SendHook implements IHook {
    @Inject
    private ZenEngine zenEngine;

    @Override
    public void after(ZenData data, ZenResult result) {
        ZenResult reportData = zenEngine.execute("get/weekByOwner", data);
        if (reportData.isEmpty()) return;
        List<String> recieves = reportData.getAsStringList("recievers");
        if (recieves == null) recieves = new ArrayList<>();
        // 获取分组ID
        List<String> groupIds = reportData.getAsStringList("groups");
        // 获取分组里的详细用户信息
        List<JsonObject> groups = zenEngine.selectByIds("week_group", groupIds);
        if (groups != null) for (JsonObject group : groups) {
            JsonArray content = group.get("content").getAsJsonArray();
            if (content == null) return;
            for (JsonElement s : content) {
                String uid = s.getAsString();
                if (recieves.contains(uid)) continue;
                recieves.add(uid);
            }
        }
        data.put("weekId", data.get("id"));
        recieves.forEach((uid) -> {
            data.put("uid", uid).refresh();
            zenEngine.execute("put/week_recieve", data);
        });
    }
}
