package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.EncryptKit;
import com.blade.mvc.http.Request;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.eventbus.model.UserNickModel;
import com.zeto.kooteam.service.install.DingTalkValidate;

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
        profile.put("username", user.getUsername());
        profile.put("mode", ZenEnvironment.getMode());
        profile.put("isLocal", ZenEnvironment.isLocalApp());
        return profile;
    }

    public ZenResult profile(ZenUser user) {
        ZenData param = ZenData.put("_id", user.getUid());
        return zenStorageEngine.execute("get/userById", param, user);
    }

    public ZenResult ding(ZenData data, ZenUser user, Request request) {
        // 查询状态
        if (data.isEmpty()) {
            String domain = request.header("Origin");
            return ZenResult.success().put("isInited", DingClient.isInited()).put("domain", domain);
        }
        if (user.getUsername().equals("root")) {
            return ZenResult.fail("只有管理员才能配置钉钉信息");
        }
        boolean status = DingTalkValidate.check(data.get("corpId"), data.get("secret"), data.get("domain"));
        if (status) {
            DingTalkValidate.Serialize();
            return ZenResult.success("配置成功").refresh();
        }
        return ZenResult.fail("钉钉配置信息校验失败");
    }

    public ZenResult password(ZenData data, ZenUser user) {
        String old = EncryptKit.md5(data.get("old"));
        if (!old.equals(user.getPwd())) {
            return ZenResult.fail("旧密码错误！");
        }
        if (!data.get("pwd").equals(data.get("pwd2"))) {
            return ZenResult.fail("两次密码输入不一致！");
        }
        String pwd = EncryptKit.md5(data.get("pwd"));
        UserMapper.i().changePassword(pwd, user.getUid());
        return ZenResult.success("修改成功！");
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
