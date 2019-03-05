package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.EncryptKit;
import com.blade.kit.PatternKit;
import com.blade.mvc.http.Request;
import com.google.common.base.Strings;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.annotation.MethodType;
import com.zeto.domain.ZenAction;
import com.zeto.domain.ZenMethod;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.eventbus.MailListener;
import com.zeto.kooteam.service.eventbus.model.UserNickModel;
import com.zeto.kooteam.service.install.DingTalkValidate;

import java.util.HashMap;
import java.util.Map;

@AccessRole
public class System extends Base {
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
            param.set("nick", user.getNick());
            param.set("email", user.getEmail());
            param.set("home", "todo/home.htm");
            param.set("skin", "3");
            param.set("calendar", "month");
            zenStorageEngine.execute("put/user", param, user);
            return zenStorageEngine.execute("get/userById", param, user);
        }
        profile.put("username", user.getUsername());
        profile.put("mode", ZenEnvironment.getMode());
        profile.put("isUpgrade", true);

        return profile;
    }

    public ZenResult profile(ZenUser user) {
        ZenData param = ZenData.put("_id", user.getUid());
        return zenStorageEngine.execute("get/userById", param, user);
    }

    public ZenResult getConfig(Request request) {
        ZenResult result = ZenResult.success().
                put("mailHost", ZenEnvironment.get("mailHost")).
                put("mailPort", ZenEnvironment.get("mailPort")).
                put("mailUser", ZenEnvironment.get("mailUser"));
        String domain = request.header("Origin");
        result.put("isDingInited", DingClient.isInited()).put("appName", domain);
        return result;
    }

    public ZenResult ding(ZenData data, ZenUser user, Request request) {
        // 查询状态
        ZenResult checkResult = checkRoot(user);
        if (checkResult != null) {
            return checkResult;
        }
        boolean status = DingTalkValidate.check(data.get("appKey"), data.get("appSecret"), data.get("appName"), data.get("corpId"));
        if (status) {
            DingTalkValidate.Serialize();
            return ZenResult.success("配置成功").refresh();
        }
        return ZenResult.fail("钉钉配置信息校验失败");
    }

    public ZenResult mail(ZenData data, ZenUser user) {
        ZenResult checkResult = checkRoot(user);
        if (checkResult != null) {
//            return checkResult;
        }
        String mailHost = data.get("mailHost"), mailPort = data.get("mailPort"),
                mailUser = data.get("mailUser"), mailPassword = data.get("mailPassword");
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
        Map<String, String> config = new HashMap<>();
        config.put("mailHost", mailHost);
        config.put("mailPort", mailPort);
        config.put("mailUser", mailUser);
        config.put("mailPassword", mailPassword);
        ZenEnvironment.serialize(config);
        MailListener.test();
        return ZenResult.success("保存成功，请检查" + mailUser + "账户测试邮件").setAction(ZenAction.SILENT);
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
        ZenUserHelper.i().changePassword(pwd, user.getUid());
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
            ZenUserHelper.i().updateNick(nick, user.getUid());
        }
        if (!Strings.isNullOrEmpty(email) && !email.equals(user.getEmail())) {
            if (!PatternKit.isEmail(email)) {
                return ZenResult.fail("保存失败！邮箱格式输入错误！");
            }
            ZenUserHelper.i().updateEmail(email, user.getUid());
        }
        return zenStorageEngine.execute("patch/user", data, user);
    }
}
