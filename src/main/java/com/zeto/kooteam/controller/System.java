package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.EncryptKit;
import com.blade.kit.PatternKit;
import com.google.common.base.Strings;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.annotation.MethodType;
import com.zeto.domain.ZenMethod;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kit.ConfigKit;
import com.zeto.kit.driver.ConfigOptionVO;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.auth.AuthService;
import com.zeto.kooteam.service.eventbus.MailListener;
import com.zeto.kooteam.service.eventbus.model.UserNickModel;

import java.util.ArrayList;
import java.util.List;

@AccessRole
public class System extends Base {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    @Inject
    private AuthService authService;

    public ZenResult my(ZenUser user) {
        if (user == null) {
            return ZenResult.success();
        }
        ZenData param = ZenData.create("_id", user.getUid());
        ZenResult profile = zenStorageEngine.execute("get/userById", param, user);
        if (profile.isEmpty()) {
            param = ZenData.create("_id", user.getUid());
            param.put("nick", user.getNick());
            param.put("email", user.getEmail());
            param.put("home", "todo/home.htm");
            param.put("skin", "3");
            param.put("calendar", "month");
            zenStorageEngine.execute("put/user", param, user);
            return zenStorageEngine.execute("get/userById", param, user);
        }
        profile.put("username", user.getUsername());
        profile.put("mode", ZenEnvironment.getMode());
        profile.put("isUpgrade", true);

        return profile;
    }

    public ZenResult profile(ZenUser user) {
        ZenData param = ZenData.create("_id", user.getUid());
        return zenStorageEngine.execute("get/userById", param, user);
    }

    public ZenResult getConfig(ZenData data) {
        List<ConfigOptionVO> config = ConfigKit.getGroup(data.get("name"));
        ZenResult result = ZenResult.success();
        for (ConfigOptionVO optionVO : config) {
            result.put(optionVO.getKey(), optionVO.getValue());
        }
        return result;
    }

    public ZenResult platformConfig(ZenData data, ZenUser user) {
        ZenResult checkResult = checkRoot(user);
        if (checkResult != null) {
            return checkResult;
        }
        List<ConfigOptionVO> configList = new ArrayList<>();
        for (String key : data.getKeys()) {
            ConfigOptionVO optionVO = new ConfigOptionVO();
            optionVO.setKey(key);
            optionVO.setValue(data.get(key));
            configList.add(optionVO);
        }
        ConfigKit.setByApp("kooteam", "account", configList);
        authService.init();
        return ZenResult.success("保存成功");
    }


    public ZenResult mail(ZenData data, ZenUser user) {
        ZenResult checkResult = checkRoot(user);
        if (checkResult != null) {
//            return checkResult;
        }
        String mailHost = data.get("host"), mailPort = data.get("port"),
                mailUser = data.get("user"), mailPassword = data.get("password");
        if (Strings.isNullOrEmpty(mailHost)) {
            return ZenResult.fail("邮件服务器地址不能为空");
        }
        if (Strings.isNullOrEmpty(mailPort) || !PatternKit.isNumber(mailPort)) {
            return ZenResult.fail("邮件发送端口错误");
        }
        if (Strings.isNullOrEmpty(mailUser) || !PatternKit.isEmail(mailUser)) {
            return ZenResult.fail("邮件账号错误");
        }
        if (Strings.isNullOrEmpty(mailPassword)) {
            return ZenResult.fail("邮件密码不能为空");
        }
        List<ConfigOptionVO> configList = new ArrayList<>();
        for (String key : data.getKeys()) {
            ConfigOptionVO optionVO = new ConfigOptionVO();
            optionVO.setKey(key);
            optionVO.setValue(data.get(key));
            configList.add(optionVO);
        }
        ConfigKit.setByApp("kooteam", "mail", configList);
        MailListener.test();
        return ZenResult.success("保存成功，请检查" + mailUser + "账户测试邮件");
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
        ZenUserKit.changePassword(pwd, user.getUid());
        return ZenResult.success("修改成功！");
    }

    @MethodType(ZenMethod.GET)
    public ZenResult upgrade() {
        Zen.upgrade();
        return ZenResult.success();
    }

    public ZenResult patch(ZenUser user, ZenData data) {
        String nick = data.get("nick"), email = data.get("email");
        if (user.getNick() == null || !user.getNick().equals(nick)) {
            UserNickModel model = new UserNickModel();
            model.setUid(user.getUid());
            model.setNick(nick);
            EventBiz.trigger(model);
            ZenUserKit.updateNick(nick, user.getUid());
        }
        if (!Strings.isNullOrEmpty(email) && !email.equals(user.getEmail())) {
            if (!PatternKit.isEmail(email)) {
                return ZenResult.fail("保存失败！邮箱格式输入错误！");
            }
            ZenUserKit.updateEmail(email, user.getUid());
        }
        return zenStorageEngine.execute("patch/user", data, user);
    }
}
