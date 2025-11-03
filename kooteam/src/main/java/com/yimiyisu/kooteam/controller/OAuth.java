package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.kit.openPlatform.DingdingPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.FeishuPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.WeworkPlatform;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.MethodType;
import com.zen.enums.ZenAction;
import com.zen.enums.ZenMethod;
import com.zen.enums.ZenRole;
import com.zen.kit.*;

@AccessRole(ZenRole.ANONYMITY)
public class OAuth extends ZenController {

    @MethodType(ZenMethod.GET)
    public ZenResult create() {
        String loginMode = ConfigKit.get("loginMode");
        String authorizeUrl;
        switch (loginMode) {
            case "dingding":
                authorizeUrl = DingdingPlatform.login();
                break;
            case "wework":
                authorizeUrl = WeworkPlatform.login();
                break;
            case "feishu":
                authorizeUrl = FeishuPlatform.login();
                break;
            default:
                return ZenResult.fail("未知登陆方式");
        }
        if (StringKit.isEmpty(authorizeUrl)) return ZenResult.fail("获取授权链接失败");
        return ZenResult.success().setAction(ZenAction.REDIRECT).setData(authorizeUrl);
    }

    // 登陆回调
    @MethodType(ZenMethod.GET)
    public ZenResult callback(ZenData data) throws Exception {
        String loginMode = ConfigKit.get("loginMode");
        String authCode = data.get("code"); // 临时授权码

        String accessToken;
        switch (loginMode) {
            case "dingding":
                accessToken = DingdingPlatform.callback(authCode);
                break;
            case "wework":
                WeworkPlatform weworkPlatform = new WeworkPlatform();
                accessToken = weworkPlatform.getAccessToken();
                break;
            case "feishu":
                FeishuPlatform feishuPlatform = new FeishuPlatform();
                accessToken = feishuPlatform.getAccessToken();
                break;
            default:
                return ZenResult.fail("未知登陆方式");
        }
        if (StringKit.isEmpty(accessToken)) return ZenResult.fail("授权失败");

        return ZenResult.success();
    }

}
