package com.yimiyisu.kooteam.events.department;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.events.department.model.DepartmentEventModel;
import com.yimiyisu.kooteam.events.department.model.DepartmentLoopEventModel;
import com.zen.annotation.Crontab;
import com.zen.interfaces.IEvent;
import com.zen.kit.ConfigKit;
import com.zen.kit.EventKit;


@Crontab("0 0 2 * * ? *")
//@Crontab("1/15 * * * * ? *")
public class DepartmentLoopEvent implements IEvent<DepartmentLoopEventModel> {
    // 同步部门数据
    @Override
    @Subscribe
    public void execute(DepartmentLoopEventModel departmentloopEventModel) {
        System.out.println("==========轮询开始==========");
        // 线上环境暂时不启用
        if (ConfigKit.isOnline()) {
            return;
        }
        DepartmentEventModel departmentEventModel = new DepartmentEventModel();
        EventKit.trigger(departmentEventModel);
    }


}