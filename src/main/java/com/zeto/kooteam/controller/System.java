package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.eventbus.model.UserNickModel;

@AccessRole
public class System {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    public ZenResult my(ZenUser user) {
        if (user == null) {
            return ZenResult.success();
        }
        ZenData param = ZenData.put("_id", user.getUid());
        ZenResult profile = zenStorageEngine.execute("get/userById", param, user);
        if (profile.isEmpty()) {
            param = ZenData.put("_id", user.getUid());
            param.add("nick", user.getNick());
            param.add("home", "todo/home.htm");
            param.add("skin", "3");
            param.add("calendar", "month");
            zenStorageEngine.execute("put/user", param, user);
            return zenStorageEngine.execute("get/userById", param, user);
        }
        profile.put("isLocal", ZenEnvironment.isLocalApp());
        return profile;
    }

    public ZenResult profile(ZenUser user) {
        ZenData param = ZenData.put("_id", user.getUid());
        return zenStorageEngine.execute("get/userById", param, user);
    }

    public ZenResult patch(ZenUser user, ZenData data) {
        String nick = data.get("nick");
        if (!user.getNick().equals(nick)) {
            UserNickModel model = new UserNickModel();
            model.setUid(user.getUid());
            model.setNick(nick);
            EventBiz.trigger(model);
            UserMapper.i().updateNick(nick, user.getUid());
        }
        return zenStorageEngine.execute("patch/user", data, user);
    }
}
