package com.zeto.kooteam.service.task;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.task.annotation.Schedule;
import com.zeto.ZenCache;
import com.zeto.driver.ZenStorageEngine;

@Bean
public class ThingTask {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    // 每天1点到3点,每隔15分钟执行一次任务调度
    @Schedule(cron = "0 0/15 2,4 * * ?")
    public void repeat() {

        // 每天零点执行任务，实现数据重复
        ZenCache.setToUnit("taskTest", DateKit.now());
    }

    // 凌晨三点，自动清理本地缓存
//    @Schedule(cron = "0 0 3 * * ?")
    public void cleanCache() {

        // 每天零点执行任务，实现数据重复
        ZenCache.setToUnit("clearCache", DateKit.now());
    }

    // 每隔一个小时，执行一次
//    @Schedule(cron = "0 0 */1 * * ?")
    public void notice() {
    }
}
