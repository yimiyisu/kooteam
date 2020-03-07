package com.zeto.kooteam.service.eventbus;

import com.google.common.eventbus.Subscribe;
import com.zeto.Zen;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.domain.ZenCondition;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.init.DocInit;
import com.zeto.kooteam.init.ProjectInit;
import com.zeto.kooteam.service.eventbus.model.UserNickModel;

public class UserNickListener {


    @Subscribe
    public void execute(UserNickModel model) {
        if (!ZenEnvironment.isPersonCloud()) {
            return;
        }
        ZenData params = ZenData.create("nick", model.getNick());
        ZenCondition condition = ZenConditionKit.And().eq("userId", model.getUid());
        ZenStorageEngine zenStorageEngine = Zen.getStorageEngine();
        zenStorageEngine.update("friend", params, condition);
    }

    @Subscribe
    public void init(ZenUser user) {
        ProjectInit.execute(user);
        DocInit.execute(user);
    }
}
