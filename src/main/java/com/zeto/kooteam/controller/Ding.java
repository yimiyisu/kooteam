package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.blade.mvc.http.Cookie;
import com.google.common.base.Strings;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.annotation.MethodType;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenMethod;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.dingtalk.service.DingAppService;
import com.zeto.kooteam.dingtalk.service.DingDepartmentService;
import com.zeto.kooteam.dingtalk.service.DingUserLoginService;
import com.zeto.kooteam.service.domain.DingApp;

@AccessRole(ZenRole.NORMAL)
public class Ding {

    @Inject
    private DingAppService dingAppService;

    @Inject
    private DingDepartmentService dingDepartmentService;

    @Inject
    private DingUserLoginService dingUserLoginService;

    private final static String loginPrefix = "dingLogin-";
    private final static long loginTime = 3600 * 24 * 30;
    private final static String dailyPrefix = "daily_";

    @MethodType(ZenMethod.ALL)
    public ZenResult qr() {
        String checkId = StringKit.objectId();
        if (ZenEnvironment.isDaily()) {
            checkId = dailyPrefix + checkId;
        }
        DingApp dingApp = DingClient.info();
        if (dingApp.getCorpId() == null) {
            return ZenResult.fail("系统配置错误，请检查app.properties文件配置信息");
        }
        return ZenResult.success().
                put("host", dingApp.getHost()).
                put("checkId", checkId);
    }

    public ZenResult wapCheck(ZenData data, ZenUser zenUser) {
        String checkId = data.get("checkId"), authCode = data.get("authCode");
        boolean updateCookie = false;
        // 返回配置信息
        if (zenUser == null) {
            // 生微应用成签名
            if (Strings.isNullOrEmpty(authCode)) {
                DingApp dingApp = DingClient.info();
                ZenResult result = ZenResult.success();
                result.put("initing", true);
                result.put("corpId", dingApp.getCorpId());
                return result;
            }
            updateCookie = true;
            zenUser = dingUserLoginService.getUserByAuthCode(authCode);
        }

        if (!Strings.isNullOrEmpty(checkId)) {
            // 非日常环境，自动更新用ukey
            if (!checkId.contains(dailyPrefix)) {
                updateCookie = true;
                zenUser = UserMapper.i().updateUkey(zenUser.getUid());
            }
            String cacheId = loginPrefix + checkId;
            ZenCache.setToUnit(cacheId, zenUser);
        }
        if (updateCookie) {
            return setCookie(zenUser);
        }
        return ZenResult.success();
    }

    // 钉钉端扫码后调用的登录接口
    public ZenResult login(ZenData data, ZenUser zenUser) {
        String checkId = data.get("checkId"), authCode = data.get("authCode");
        if (zenUser == null) {
            if (Strings.isNullOrEmpty(authCode)) {
                return ZenResult.fail();
            }
            zenUser = dingUserLoginService.getUserByAuthCode(authCode);
        }
        if (zenUser == null) {
            return ZenResult.fail();
        }
        // 手机端直接登录
        if (Strings.isNullOrEmpty(checkId)) {
            String appId = DingClient.info().getAppId();
            return ZenResult.success().
                    put("nick", zenUser.getNick()).
                    put("ukey", zenUser.getUkey()).
                    put("uid", zenUser.getUid()).
                    put("appId", appId).
                    put("auth", authCode);
        }
        // 非日常环境，自动更新用ukey
        if (!checkId.contains(dailyPrefix)) {
            zenUser = UserMapper.i().updateUkey(zenUser.getUid());
        }
        String cacheId = loginPrefix + checkId;
        ZenCache.setToUnit(cacheId, zenUser);
        return ZenResult.success().put("checkId", checkId).put("auth", authCode);
    }

    // 用户是否登录身份校验
    public ZenResult checkLogin(ZenData data, ZenCookie cookie) {
        String uid = cookie.get("uid"),
                ukey = cookie.get("ukey"),
                checkId = data.get("id");
        // 跳转到登陆页面
        if (ZenEnvironment.isLocalApp() && !DingClient.isDD()) {
            return ZenResult.jump("/install.html", "系统尚未初始化");
        }
        // 判断系统是否初始化，没有的话，自动跳转到登陆页面
        ZenUser user;
        if (checkId != null) {// 优先扫码登录
            String cacheId = loginPrefix + checkId;
            user = ZenCache.getFromUnitWithClean(cacheId, ZenUser.class);
            if (user == null) {
                return ZenResult.fail();
            }
            return setCookie(user);
        }
        // 已登录过的，只校验cookie
        if (uid != null && ukey != null) {
            user = UserMapper.i().get(uid);
            if (user != null && ukey.equals(user.getUkey())) {
                return ZenResult.success();
            }
        }
        return ZenResult.fail();
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
}
