package com.yimiyisu.kooteam.service;

import com.yimiyisu.kooteam.kit.WeixinKit;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Component;
import com.zen.annotation.Inject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WxAuthService {
    private final Map<String, Map<String, String>> mpCache = new ConcurrentHashMap<>();

    @Inject
    private ZenEngine zenEngine;

    /**
     * 获取openId
     */
    public String getOpenId(String mpId, String code) {
        Map<String, String> mpInfo = getMpInfo(mpId);
        String appId = mpInfo.get("appId");
        String appSecret = mpInfo.get("appSecret");
        return WeixinKit.wxOpenPlatformOpenId(appId, appSecret, code);
    }

    /**
     * 获取公众号accessToken
     */
    public String getminiAppToken(String mpId) {
        Map<String, String> mpInfo = getMpInfo(mpId);
        String appId = mpInfo.get("appId");
        String appSecret = mpInfo.get("appSecret");
        return WeixinKit.getMiniAppToken(mpId, appId, appSecret);
    }

    /**
     * 获取公众号信息
     */
    public Map<String, String> getMpInfo(String mpId) {
        return mpCache.computeIfAbsent(mpId, id -> {
            ZenResult mp = zenEngine.execute("get/mp", ZenData.create("id", id));
            Map<String, String> info = new HashMap<>();
            info.put("appId", mp.get("appId"));
            info.put("appSecret", mp.get("appSecret"));
            info.put("image", mp.get("image"));
            return info;
        });
    }
}
