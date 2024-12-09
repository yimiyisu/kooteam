package com.yimiyisu.kooteam.kit.openPlatform;

import com.zen.domain.ZenUser;
import com.zen.kit.*;

import java.util.Map;


public class WeworkPlatform implements IOpenPlatform {
    private static final String TOKEN_KEY = "WEWORK_TOKEN";

    @Override
    public void refreshToken() {

    }

    @Override
    public void completeUser(ZenUser user) {
        if (StringKit.isEmpty(user.getOpenId())) return;
        String token = this.getAccessToken();
        String url = "https://qyapi.weixin.qq.com/cgi-bin/user/get?userid=" + user.getOpenId() + "&access_token=" + token;
        Map<String, Object> result = HttpKit.getAsMap(url);
        if (result.containsKey("userid")) {
            if (result.containsKey("avatar")) {
                String avatar = result.get("avatar").toString();
                // 把平台头像缓存到本地
                avatar = UploadKit.image(avatar, "/user/" + user.getId() + ".jpg");
                user.setAvatar(avatar);
            }
            if (result.containsKey("email")) {
                user.setEmail(result.get("email").toString());
            }
            UserKit.update(user);
        }
        System.out.println(result);
    }

    public String getAccessToken() {
        String token = CacheKit.get(WeworkPlatform.TOKEN_KEY);
        if (StringKit.isNotEmpty(token)) return token;
        String corpId = ConfigKit.get("weworkId");
        String corpSecret = ConfigKit.get("weworkAppSecret");
        String url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" + corpId + "&corpsecret=" + corpSecret;
        Map<String, Object> result = HttpKit.getAsMap(url);
        if (result.containsKey("access_token")) {
            token = result.get("access_token").toString();
            CacheKit.set(WeworkPlatform.TOKEN_KEY, token);
        }
        return token;
    }

    @Override
    public String sendMessage(ZenUser to, String content) {
        return "";
    }
}
