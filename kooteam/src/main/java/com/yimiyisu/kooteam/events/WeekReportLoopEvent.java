package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.domain.WeekReportDO;
import com.yimiyisu.kooteam.events.model.WeekReportLoopModel;
import com.yimiyisu.kooteam.service.EmailService;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Crontab;
import com.zen.annotation.Inject;
import com.zen.interfaces.IEvent;
import com.zen.kit.DateKit;

import java.util.List;

/*
    周报日报，发送事件 - 定时发送
 */
@Crontab("0/30 * * * * ? *")
public class WeekReportLoopEvent implements IEvent<WeekReportLoopModel> {

    @Inject
    private ZenEngine zenEngine;
    @Inject
    private EmailService emailService;

    @Override
    @Subscribe
    public void execute(WeekReportLoopModel event) {
        // 查询未发送且有定时时间的周报
        ZenResult weekListResult = zenEngine.execute("list/week_timer", ZenData.create()
                .put("status", 2).put("timer", 0));
        if (weekListResult.isEmpty()) return;
        List<WeekReportDO> weekReportList = weekListResult.asList(WeekReportDO.class);

        // 比对定时时间
        for (WeekReportDO weekReport : weekReportList) {
            long timer = weekReport.getTimer();
            long now = DateKit.now();
            long timediff = timer - now;
            if (timediff < 0 || timediff > 10) { // 当前时间超过发送时间或在10s内 都创建消息等待轮训任务发送
                emailService.sendWeekReport(weekReport.getId(), weekReport.getUid());
            }
        }
    }
}
