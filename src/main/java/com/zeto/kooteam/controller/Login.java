package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.EncryptKit;
import com.blade.kit.StringKit;
import com.blade.mvc.http.Cookie;
import com.google.common.base.Strings;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.dingtalk.service.DingAppService;
import com.zeto.kooteam.dingtalk.service.DingDepartmentService;
import com.zeto.kooteam.dingtalk.service.DingUserLoginService;
import com.zeto.kooteam.service.domain.DingApp;

@AccessRole(ZenRole.NORMAL)
public class Login {

    @Inject
    private DingAppService dingAppService;

    @Inject
    private DingDepartmentService dingDepartmentService;

    @Inject
    private DingUserLoginService dingUserLoginService;
    @Inject
    private ZenStorageEngine zenStorageEngine;

    private final static String error = "用户名或账号错误";
    private final static long loginTime = 3600 * 24 * 30;
    private final static String dailyPrefix = "daily_";
    private final static String loginPrefix = "dingLogin-";

    public ZenResult type() {
        ZenResult result = ZenResult.success();
        if (DingClient.isInited()) {
            result.put("qr", "dd");
            result.put("checkId", StringKit.objectId());
            result.put("host", DingClient.info().getHomeUrl());
        }
        return result;
    }

    // 账号，密码验证
    public ZenResult checkPwd(ZenData data) {
        ZenUser user = ZenUserKit.getByName(data.get("user"));
        if (user == null) {
            return ZenResult.fail(error);
        }
        String pwd = data.get("pwd");
        if (Strings.isNullOrEmpty(pwd)) {
            return ZenResult.fail(error);
        }
        pwd = EncryptKit.md5(pwd);
        if (!pwd.equals(user.getPwd())) {
            return ZenResult.fail(error);
        }
        // 更新ukey
        user = ZenUserKit.updateUkey(user.getUid());
        return setCookie(user);
    }

    // 轮询checkId，判断用户是否登陆
    public ZenResult checkId(ZenData data) {
        String checkId = data.get("checkId");
        if (Strings.isNullOrEmpty(checkId)) {
            return ZenResult.fail();
        }
        String cacheId = loginPrefix + checkId;
        ZenUser user = ZenCache.getFromUnitWithClean(cacheId, ZenUser.class);
        if (user == null) {
            return ZenResult.fail();
        }
        return setCookie(user);
    }

    public ZenResult dingWap(ZenData data, ZenUser zenUser) {
        String checkId = data.get("checkId"), authCode = data.get("authCode");
        boolean updateCookie = false;
        // 返回配置信息
        if (zenUser == null) {
            // 生微应用成签名
            if (Strings.isNullOrEmpty(authCode)) {
                DingApp dingApp = DingClient.info();
                ZenResult result = ZenResult.success();
                result.put("initing", true);
                result.put("agentId", dingApp.getAgentId());
                result.put("corpId", dingApp.getCorpId());
                return result;
            }
            updateCookie = true;
            zenUser = dingUserLoginService.getUserByAuthCode(authCode);
        }
        if (zenUser == null) {
            return ZenResult.success();
        }

        if (!Strings.isNullOrEmpty(checkId)) {
            // 非日常环境，自动更新用ukey
            if (!checkId.contains(dailyPrefix)) {
                updateCookie = true;
                zenUser = ZenUserKit.updateUkey(zenUser.getUid());
            }
            String cacheId = loginPrefix + checkId;
            ZenCache.setToUnit(cacheId, zenUser);
        }
        if (updateCookie) {
            return setCookie(zenUser);
        }
        return ZenResult.success();
    }

    private ZenResult setCookie(ZenUser user) {
        // 扫码登录
        Cookie uid = new Cookie();
        uid.maxAge(loginTime);
        uid.name("uid");
        uid.value(user.getUid());
        uid.httpOnly(true);

        Cookie ukeyCookie = new Cookie();
        ukeyCookie.maxAge(loginTime);
        ukeyCookie.name("ukey");
        ukeyCookie.value(user.getUkey());
        ukeyCookie.httpOnly(true);

        return ZenResult.success().addCookie(ukeyCookie).addCookie(uid);
    }

    public ZenResult checkStatus(ZenCookie cookie) {
        if (ZenEnvironment.isNoSetup()) {
            return ZenResult.jump("/install.html", "系统尚未初始化");
        }
        String uid = cookie.get("uid"),
                ukey = cookie.get("ukey");
        if (uid != null && ukey != null) {
            ZenUser user = ZenUserKit.get(uid);
            if (user != null && ukey.equals(user.getUkey())) {
                ZenResult profile = zenStorageEngine.execute("get/userById", ZenData.put("_id", uid), user);
                return profile;
            }
        }
        return ZenResult.fail();
    }
}
