package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.google.common.base.Strings;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.ZenTokenKit;
import com.zeto.annotation.AccessRole;
import com.zeto.annotation.MethodType;
import com.zeto.domain.ZenMethod;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.auth.AuthService;
import com.zeto.kooteam.service.auth.LADPService;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@AccessRole(ZenRole.ANONYMITY)
public class Home {
    @Inject
    private ZenStorageEngine zenStorageEngine;
    @Inject
    private AuthService authService;

    @Inject
    private LADPService ladpService;

    @MethodType(ZenMethod.GET)
    public ZenResult wechatWap(ZenData data) {
        String state = data.get("state");
        String code = data.get("code");
        if (state == null || code == null) {
            return ZenResult.fail("授权链接错误");
        }
        ZenUser user = authService.getUser(code);
        if (user == null) {
            return ZenResult.fail("获取用户信息失败");
        }
        return ZenResult.jsRedirect(getHomePage(user), ZenTokenKit.profile(user));
    }

    // 钉钉应用端自动登录
    public ZenResult dingWap(ZenData data, ZenUser user) {
        String checkId = data.get("checkId");
        if (checkId == null) {
            return ZenResult.fail("token错误");
        }
        if (user == null) {
            String code = data.get("code");
            if (code == null) {
                return ZenResult.fail("授权链接错误");
            }
            user = authService.getUser(code);
            if (user == null) {
                return ZenResult.fail("获取用户信息失败");
            }
        }
        ZenTokenKit.set(checkId, user.getUid());
        return ZenResult.login(ZenTokenKit.profile(user));
    }

    public ZenResult token() {
        return ZenResult.redirect("/home.html");
    }

    // LADP登录配置
    public ZenResult ladp(ZenData data) {
        String username = data.get("username");
        String password = data.get("password");
        if (Strings.isNullOrEmpty(username) || Strings.isNullOrEmpty(password)) {
            return ZenResult.fail("用户名与密码不能为空");
        }
        ZenUser user = ladpService.login(username, password);
        if (user == null) {
            return ZenResult.fail("登录失败，用户名不存在或密码错误。");
        }
        return ZenResult.login(getHomePage(user), ZenTokenKit.profile(user));
    }

    // 判断用户是否登陆，轮询checkId实现扫码自动登录，判断系统是否初始化过
    public ZenResult loginCheck(ZenData data, ZenUser user) {
        if (ZenEnvironment.isNoSetup()) {
            return ZenResult.redirect("/install.html");
        }
        // 用户已登录，直接跳转到首页
        if (user != null) {
            return ZenResult.redirect(getHomePage(user));
        }
        String checkId = data.get("checkId");
        // 通过后天配置文件，判断是否设置了，企业微信，钉钉信息，展示相关的二维码登录
        if (Strings.isNullOrEmpty(checkId)) {
            checkId = StringKit.objectId();
            return authService.params(checkId);
        }
        // 钉钉定时轮训检测登录状态
        user = ZenTokenKit.check(checkId);
        if (user == null) {
            return ZenResult.success();
        }
        // 跳转到登录页面
        return ZenResult.login(getHomePage(user), ZenTokenKit.profile(user));
    }

    // 获取当前用户的默认首页
    private String getHomePage(ZenUser user) {
        return "/todo/home.xhtm";
    }
}
