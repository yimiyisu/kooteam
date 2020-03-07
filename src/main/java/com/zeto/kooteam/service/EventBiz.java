package com.zeto.kooteam.service;

import com.blade.mvc.WebContext;
import com.google.common.base.Strings;
import com.google.common.eventbus.AsyncEventBus;
import com.zeto.domain.ZenUser;
import com.zeto.kooteam.service.eventbus.MailListener;
import com.zeto.kooteam.service.eventbus.MessageListener;
import com.zeto.kooteam.service.eventbus.ProjectListener;
import com.zeto.kooteam.service.eventbus.UserNickListener;
import com.zeto.kooteam.service.eventbus.model.EmployeeModel;
import com.zeto.kooteam.service.eventbus.model.MailMode;
import com.zeto.kooteam.service.eventbus.model.MessageModel;
import com.zeto.kooteam.service.eventbus.model.ProjectModel;

import java.util.concurrent.Executors;

public class EventBiz {
    private static final AsyncEventBus eventBus = new AsyncEventBus(Executors.newFixedThreadPool(3));

    // 初始化事件
    public static void init() {
        eventBus.register(new ProjectListener());
        eventBus.register(new UserNickListener());
        eventBus.register(new MessageListener());
        eventBus.register(new MailListener());
    }

    public static void employeeSync() {
        EmployeeModel model = new EmployeeModel();
        model.setId("employee");
        eventBus.post(model);
    }

    public static void sendMessage(MessageModel model) {
        eventBus.post(model);
    }

    public static void sendMail(MailMode mode) {
        eventBus.post(mode);
    }

    // 项目统计
    public static void projectState(String projectId) {
        if (Strings.isNullOrEmpty(projectId)) {
            return;
        }
        ProjectModel model = new ProjectModel();
        model.setProjectId(projectId);
        model.setSite(WebContext.get().getZenSite());
        eventBus.post(model);
    }

    public static void userInit(ZenUser user) {
        eventBus.post(user);
    }

    public static void trigger(Object model) {
        eventBus.post(model);
    }
}
