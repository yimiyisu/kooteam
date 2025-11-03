package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.domain.WeekReportDO;
import com.yimiyisu.kooteam.service.EmailService;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.enums.ZenRole;

@AccessRole(ZenRole.SIGNATURE)
public class WeekReport extends ZenController {

    @Inject
    private ZenEngine zenEngine;
    @Inject
    private EmailService emailService;

    public ZenResult send(ZenData data) {
        String weekId = data.get("id");
        String uid = data.getUid();
        long timer = Long.parseLong(data.get("timer"));
        zenEngine.execute("patch/week", ZenData.create(data).put("id", weekId).put("status", 2));
        if (timer == 0) { // 没有定时 - 直接发送
            emailService.sendWeekReport(weekId, uid);
            return ZenResult.success("操作成功");
        }

        // 有定时 - 不操作等待轮训操作
        return ZenResult.success("操作成功");
    }
}
