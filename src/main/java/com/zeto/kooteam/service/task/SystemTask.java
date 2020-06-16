package com.zeto.kooteam.service.task;

import com.blade.ioc.annotation.Bean;
import com.blade.task.annotation.Schedule;
import com.zeto.Zen;
import com.zeto.kooteam.service.EventBiz;

// 企业报表生成
@Bean
public class SystemTask {
    // 凌晨2点自动同步通讯录
    @Schedule(cron = "0 0 2 * * ?")
    public void employee() {
        EventBiz.employeeSync();
    }

    // 凌晨4点自动检测最新版本
    @Schedule(cron = "0 0 4 * * ?")
    public void upgrade() {
        Zen.checkVersion();
    }
}
