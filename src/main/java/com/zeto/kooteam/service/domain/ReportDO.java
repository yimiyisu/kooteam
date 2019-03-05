package com.zeto.kooteam.service.domain;

import lombok.Data;

@Data
public class ReportDO {
    // 是否开启日报
    private Boolean daily = false;
    // 是否开启周报
    private Boolean week = true;
    // 日报抄送邮件
    private String dailyMail;
    // 日报抄送人
    private String dailyTo;
    private String dailyTime = "20:00:00";

    // 周报抄送邮件
    private String weekMail;
    // 周报抄送人
    private String weekTo;

    private int weekNumber = 5;
    private String weekTime = "20:00:00";
}
