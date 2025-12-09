package com.yimiyisu.kooteam.hooks.thingLog;

import com.yimiyisu.kooteam.events.model.ThingEmailEventModel;
import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;
import com.zen.kit.EventKit;
import com.zen.kit.JsonKit;
import com.zen.kit.StringKit;

import java.util.Map;

@ZenHook("put/thing_log")
public class PutThingLog implements IHook {

    @Override
    public void after(ZenData data, ZenResult result) {
        // 获取参数
        String typeStr = data.get("type"); // 操作类型
        if (StringKit.isEmpty(typeStr)) return;
        int type = Integer.parseInt(typeStr);

        String thingId = data.get("thingId"); // 待办id
        Map<String, Object> original = data.getAsMap("original");// 原始数据

        // 调用异步发送邮件
        ThingEmailEventModel thingEmailEventModel = ThingEmailEventModel.builder()
                .from(result.get("uid"))
                .thingId(thingId)
                .type(type)
                .original(JsonKit.stringify(original))
                .content(result.get("content"))
                .logUid(result.get("uid"))
                .build();
        EventKit.trigger(thingEmailEventModel);

        IHook.super.after(data, result);
    }
}
