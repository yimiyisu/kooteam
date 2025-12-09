package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.events.model.AIWeekReportEventModel;
import com.yimiyisu.kooteam.service.EmailService;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.enums.ZenRole;
import com.zen.kit.DateKit;
import com.zen.kit.EventKit;

@AccessRole(ZenRole.SIGNATURE)
public class WeekReport extends ZenController {

    @Inject
    private ZenEngine zenEngine;
    @Inject
    private EmailService emailService;

    // 发送周报
    public ZenResult send(ZenData data) {
        String weekId = data.get("id");
        String uid = data.getUid();
        long timer = Long.parseLong(data.get("timer"));
        zenEngine.execute("patch/week", ZenData.create(data).put("id", weekId).put("status", 2));
        if (timer == 0) { // 没有定时 - 直接发送
            emailService.sendWeekReport(weekId, uid, "week");
            return ZenResult.success("操作成功");
        }

        // 有定时 - 不操作等待轮训操作
        return ZenResult.success("操作成功");
    }

    public ZenResult sendAIReport(ZenData data) {
        String weekId = data.get("id");
        String uid = data.getUid();
        zenEngine.execute("patch/ai_week", ZenData.create().put("id", weekId).put("isSend", 2).put("timer", DateKit.now()));
        emailService.sendWeekReport(weekId, uid, "ai_week");
        return ZenResult.success("操作成功");
    }

    // 创建ai周报
    public ZenResult createAIReport(ZenData data) {
        // 插入数据
        ZenResult putResult = zenEngine.execute("put/ai_week", data);
        String weekId = putResult.get("id");

        // 异步调用deepseek生成周报
        AIWeekReportEventModel eventModel = new AIWeekReportEventModel();
        eventModel.setWeekId(weekId);
        EventKit.trigger(eventModel);
        return ZenResult.success("正在生成，请稍后查看");
    }

}
