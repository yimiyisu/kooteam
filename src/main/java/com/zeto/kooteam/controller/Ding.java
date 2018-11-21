package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.blade.mvc.http.Cookie;
import com.google.common.base.Strings;
import com.zeto.ZenCache;
import com.zeto.ZenCookie;
import com.zeto.ZenData;
import com.zeto.ZenResult;
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

    @MethodType(ZenMethod.ALL)
    public ZenResult qr() {
        String checkId = StringKit.objectId();
        DingApp dingApp = DingClient.info();
        if (dingApp.getAppId() == null) {
            return ZenResult.fail("系统配置错误，请检查app.properties文件配置信息");
        }
        return ZenResult.success().
                put("appId", dingApp.getAppId()).
                put("corpId", dingApp.getCorpId()).
                put("agentId", dingApp.getAgentId()).
                put("checkId", checkId);
    }

    // 钉钉端扫码后调用的登录接口
    public ZenResult login(ZenData data) {
        String checkId = data.get("checkId"), authCode = data.get("authCode");
        ZenUser zenUser = dingUserLoginService.getUserByAuthCode(authCode);
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
        String cacheId = loginPrefix + checkId;
        ZenCache.setToUnit(cacheId, zenUser);
        return ZenResult.success().put("checkId", checkId).put("auth", authCode);
    }

    // 用户是否登录身份校验
    public ZenResult checkLogin(ZenData data, ZenCookie cookie) {
        String uid = cookie.get("uid"),
                ukey = cookie.get("ukey"),
                checkId = data.get("id");
        ZenUser user;
        if (checkId != null) {// 优先扫码登录
            String cacheId = loginPrefix + checkId;
            user = ZenCache.getFromUnitWithClean(cacheId, ZenUser.class);
            if (user == null) {
                return ZenResult.fail();
            }
            // 扫码登录
            Cookie uidCookie = new Cookie();
            uidCookie.maxAge(loginTime);
            uidCookie.name("uid");
            uidCookie.value(user.getUid());
            uidCookie.httpOnly(true);

            Cookie ukeyCookie = new Cookie();
            ukeyCookie.maxAge(loginTime);
            ukeyCookie.name("ukey");
            ukeyCookie.value(user.getUkey());
            ukeyCookie.httpOnly(true);
            return ZenResult.success().addCookie(uidCookie).addCookie(ukeyCookie);
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

    // 安装成功
    public ZenResult install() {
        return ZenResult.success();
    }
}
