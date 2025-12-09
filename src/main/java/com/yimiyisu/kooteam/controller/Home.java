package com.yimiyisu.kooteam.controller;

import com.google.gson.JsonObject;
import com.yimiyisu.kooteam.kit.WeixinKit;
import com.yimiyisu.kooteam.service.WxAuthService;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.annotation.MethodType;
import com.zen.annotation.Tracker;
import com.zen.domain.DecryptResult;
import com.zen.domain.MessageDO;
import com.zen.domain.ZenUser;
import com.zen.enums.ZenMethod;
import com.zen.enums.ZenRole;
import com.zen.kit.*;
import lombok.extern.slf4j.Slf4j;

import java.lang.System;

@Slf4j
@AccessRole(ZenRole.ANONYMITY)
public class Home extends ZenController {
    private static final String APPS_KEY = "apps";
    @Inject
    private ZenEngine zenEngine;
    @Inject
    private WxAuthService wxAuthService;

    @MethodType(ZenMethod.ALL)
    @Tracker(10)
    public ZenResult test(ZenData data) {
        String httpContent = HttpKit.get("https://www.baidu.com/index.html");
        return ZenResult.success().setData(httpContent);
    }

    public ZenResult apps() {
        JsonObject apps = ConfigKit.self(Home.APPS_KEY);
        ZenResult result = ZenResult.success();
        if (apps != null && !apps.isEmpty())
            result.setData(apps.getAsJsonArray(Home.APPS_KEY));
        return result;
    }

    // 手工触发单个消息发送
    public ZenResult message(ZenData data) {
        ZenUser user = data.getUser();
        if (user == null)
            return ZenResult.success();
        MessageDO messageDO = MessageKit.get(data.get("messageId"));
        if (messageDO == null)
            return ZenResult.success();
        EventKit.trigger(messageDO);
        return ZenResult.success();
    }

    public ZenResult list() {
        return ZenResult.success().setData(MessageKit.queue());
    }

    // 开放知识库
    public ZenResult note(ZenData data) {
        ZenResult noteResult = zenEngine.execute("get/note", data);
        int type = noteResult.getInt("pub");
        ZenUser user = data.getUser();
        if (type != 0 && user == null)
            return ZenResult.fail("您无访问权限");
        if (type == 1) if (user.getRole() < ZenRole.CONSOLE.value())
            return ZenResult.fail("您无访问权限").setData(-1);
        return noteResult;
    }

    public ZenResult noteContent(ZenData data) {
        ZenResult noteContentResult = zenEngine.execute("get/note_content", data);
        ZenResult noteResult = zenEngine.execute("get/note",
                ZenData.create(data).put("id", noteContentResult.get("noteId")));
        int type = noteResult.getInt("pub");
        ZenUser user = data.getUser();
        if (type != 0 && user == null)
            return ZenResult.fail("您无访问权限");
        if (type == 1) if (user.getRole() < ZenRole.CONSOLE.value())
            return ZenResult.fail("您无访问权限");
        return noteContentResult;
    }

    @MethodType(ZenMethod.ALL)
    public ZenResult outIp(ZenData data) {
        this.checkOAuth(data);

        // SimpleHttpResponse response = HttpUtil.get("https://ipv4_cm.itdog.cn");
        // return ZenResult.success().setData(response);
        // curl -x http://172.24.0.12:8899 https://ifconfig.io/ip
        String ip = HttpKit.get("https://ifconfig.io/ip");
        // String ip = HttpKit.get("https://ipv4_cm.itdog.cn");
        // if (ip == null) ip = "无外网访问权限";
        return ZenResult.success().setData(ip);
    }

    // 生成服务号授权链接
    public ZenResult makeWxLink(ZenData data) {
        String mpId = data.get("appid");
        String appId = zenEngine.execute("get/mp", ZenData.create("id", mpId)).get("appId");
        String redirect = ConfigKit.get("mpRedirect");
        String id = data.get("id");
        String url = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + appId +
                "&redirect_uri=" + redirect + "&response_type=code&scope=snsapi_base&state=" + id + "#wechat_redirect";
        return ZenResult.success().setData(url);
    }

    // 服务号授权完成跳转
    @MethodType(ZenMethod.ALL)
    public ZenResult jump(ZenData data) {
        // 是否从公众号页面返回
        String polling = data.get("polling");

        String openIdEncrypt = data.get("encrypt");
        String id = data.get("state");
        String code = data.get("code");
        ZenResult authResult = zenEngine.execute("get/wx_auth", ZenData.create("id", id));
        String mpId = authResult.get("appid");
        String openId = null;
        if (StringKit.isEmpty(openIdEncrypt)) openId = wxAuthService.getOpenId(mpId, code);
        else {
            DecryptResult decryptResult = StringKit.decrypt(openIdEncrypt);
            openId = decryptResult.getValue();
        }
        boolean subscribed = true;
        if (authResult.getInt("subscribed") == 1) {
            String accessToken = wxAuthService.getminiAppToken(mpId);
            subscribed = WeixinKit.isSubscribed(accessToken, openId);
        }
        String encrypt = StringKit.encrypt(openId);
        String domain = authResult.get("domain");
        domain += "?xy=" + encrypt;
        if (!subscribed) {
            if (StringKit.isNotEmpty(polling)) return ZenResult.success();
            String image = wxAuthService.getMpInfo(mpId).get("image");
            String appDomain = ConfigKit.get("appDomain") + "/wap.html#/wap/subscribed?state=" + id + "&encrypt="
                    + encrypt + "&image=" + image;
            return ZenResult.redirect(appDomain);
        }
        if (StringKit.isNotEmpty(polling)) return ZenResult.jump(domain);
        System.out.println(domain);
        return ZenResult.redirect(domain);
    }

    /**
     * 体验环境移动端kooteam登录
     */
    public ZenResult trialLogin(ZenData data) {
        if (ConfigKit.get("trialUid") != null) {
            String token = UserKit.createToken(ConfigKit.get("trialUid"));
            return ZenResult.success().setData(token);
        }
        return ZenResult.success();
    }
}
