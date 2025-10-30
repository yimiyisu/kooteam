package com.yimiyisu.kooteam.hooks.thingLog;

import com.yimiyisu.kooteam.events.model.ThingEmailEventModel;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;
import com.zen.kit.EventKit;
import com.zen.kit.StringKit;

import java.util.List;

@ZenHook("put/thing_log")
public class PutThingLog implements IHook {

    @Override
    public void after(ZenData data, ZenResult result) {
        // 获取参数
        String typeStr = data.get("type"); // 操作类型
        if (StringKit.isEmpty(typeStr)) return;
        int type = Integer.parseInt(typeStr);

        String thingId = data.get("thingId"); // 待办id
        String original = data.get("original"); // 原始数据

        // 调用异步发送邮件
        ThingEmailEventModel thingEmailEventModel = ThingEmailEventModel.builder()
                .from(result.get("uid"))
                .thingId(thingId)
                .type(type)
                .original(original)
                .build();
        EventKit.trigger(thingEmailEventModel);

        IHook.super.after(data, result);
    }
}
