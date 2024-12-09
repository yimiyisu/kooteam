package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.kit.OpenPlatformKit;
import com.zen.ZenEngine;
import com.zen.annotation.Inject;
import com.zen.domain.NewUserEventModel;
import com.zen.domain.ZenUser;
import com.zen.interfaces.IEvent;

/**
 * 系统新增用户异步事件
 */
public class NewUserEvent implements IEvent<NewUserEventModel> {

    @Inject
    private ZenEngine zenEngine;

    @Override
    @Subscribe
    public void execute(NewUserEventModel model) {
        ZenUser user = model.getUser();
        if (user == null) return;
        OpenPlatformKit.completeUser(user);
    }
}
