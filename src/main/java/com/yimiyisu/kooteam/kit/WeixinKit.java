package com.yimiyisu.kooteam.kit;

import com.zen.kit.CacheKit;
import com.zen.kit.HttpKit;
import com.zen.kit.StringKit;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;

@Slf4j
public class WeixinKit {
    private final static String TOKEN_OPEN_CACHE_KEY = "wx-app-open-token";

    // 获取开放平台token
    public static String getMiniAppToken(String mpId, String appid, String appsecret) {
        String cacheKey = WeixinKit.TOKEN_OPEN_CACHE_KEY + ":" + mpId;
        String token = CacheKit.get(cacheKey);
        if (StringKit.isNotEmpty(token)) return token;

        HashMap<String, Object> params = new HashMap<>();
        params.put("grant_type", "client_credential");
        params.put("appid", appid);
        params.put("secret", appsecret);

        Map<String, Object> result = HttpKit.getAsMap("https://api.weixin.qq.com/cgi-bin/token", params);
        if (result.containsKey("access_token")) {
            token = result.get("access_token").toString();
            CacheKit.set(cacheKey, token, 90);
            return token;
        }
        return null;
    }

    /**
     * 静默获取微信公众号用户openId，同步返回用户access_token，通过该token可以进一步那用户授权详细信息
     * 官方文档 https://developers.weixin.qq.com/doc/offiaccount/OA_Web_Apps/Wechat_webpage_authorization.html#0
     */
    public static String wxOpenPlatformOpenId(String appId, String appSecret, String code) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("appid", appId);
        params.put("secret", appSecret);
        params.put("code", code);
        params.put("grant_type", "authorization_code");
        Map<String, Object> result = HttpKit.getAsMap("https://api.weixin.qq.com/sns/oauth2/access_token", params);
        if (result.containsKey("openid")) return result.get("openid").toString();
        return null;
    }

    /**
     * 判断用户是否关注公众号
     */
    public static boolean isSubscribed(String accessToken, String openId) {
        HashMap<String, Object> params = new HashMap<>();
        params.put("access_token", accessToken);
        params.put("openid", openId);
        Map<String, Object> result = HttpKit.getAsMap("https://api.weixin.qq.com/cgi-bin/user/info", params);
        if (result.containsKey("subscribe")) return !"0.0".equals(result.get("subscribe").toString());
        return false;
    }
}
