package com.zeto.kooteam.service.auth.wechat;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.HttpKit;
import com.blade.kit.StringKit;
import com.zeto.ZenCache;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.ZenUserKit;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import com.zeto.kit.ConfigKit;
import com.zeto.kooteam.service.UploaderService;
import com.zeto.kooteam.service.auth.Client;
import lombok.extern.slf4j.Slf4j;

import java.util.Map;

@Bean
@Slf4j
public class WechatClient implements Client {
    private String corpId;
    private String agentId;
    private String secret;
    private static final String TOKEN_URL = "https://qyapi.weixin.qq.com/cgi-bin/gettoken";
    private static final String USERINFO_URL = "https://qyapi.weixin.qq.com/cgi-bin/user/getuserinfo";
    private static final String USER_DETAIL_URL = "https://qyapi.weixin.qq.com/cgi-bin/user/get";
    private static final String TOKEN_KEY = "access_token";
    private static final Integer SUCCESS_STATUS = 0;

    @Inject
    private UploaderService uploaderService;

    public void init(String key) {
        corpId = ConfigKit.getByApp(key, "wxCorpid");
        agentId = ConfigKit.getByApp(key, "wxKey");
        secret = ConfigKit.getByApp(key, "wxSecret");
    }

    private String token() {
        String token = ZenCache.get(TOKEN_KEY);
        if (token != null) {
            return token;
        }
        Map<String, Object> data = HttpKit.getAsMap(TOKEN_URL, ZenData.create("corpid", corpId).put("corpsecret", secret));
        if (!data.get("errcode").equals(SUCCESS_STATUS)) {
            log.error("wechatTokenError", data);
            return null;
        }
        token = data.get(TOKEN_KEY).toString();
        ZenCache.set(TOKEN_KEY, token, 100);
        return token;
    }

    public String check() {
        Map<String, Object> data = HttpKit.getAsMap(TOKEN_URL, ZenData.create("corpid", corpId).put("corpsecret", secret));
        if (!data.get("errcode").equals(SUCCESS_STATUS)) {
            return data.get("errcode") + "-" + data.get("errmsg");
        }
        return null;
    }

    public ZenResult params(String checkId) {
        return ZenResult.success()
                .put("appid", corpId)
                .put("agentid", agentId)
                .put("redirect_uri", "/home/wechatWap.do")
                .put("checkId", checkId);
    }

    public String qr(String authID) {
//        String rebackURL = StringKit.urlEncode("http://kooteam.proxy.zeto.me/home/wapUserInfo.do");
        String rebackURL = "http://kooteam.proxy.zeto.me/home/wapUserInfo.do";
        return "https://open.weixin.qq.com/connect/oauth2/authorize?appid="
                + corpId + "&redirect_uri=" + rebackURL + "&response_type=code&scope=snsapi_base&state="
                + authID + "#wechat_redirect";
    }

    public void updateUser(String unionId) {
        ZenUser user = ZenUserKit.getByUnionId(unionId, ZenRole.WECHAT);
        if (user == null) {
            return;
        }
        String token = this.token(), uid = user.getUid();
        Map<String, Object> userData = HttpKit.getAsMap(USER_DETAIL_URL, ZenData.create("access_token", token).put("userid", unionId));
        if (!userData.get("errcode").equals(SUCCESS_STATUS)) {
            log.error("wechatUserDetailError", userData);
            return;
        }
//        user.setUsername(userData.get("userid").toString());
//        user.setNick(userData.get("name").toString());
//        user.setTag(ZenRole.WECHAT.tagValue());
//        user.setMobile(userData.get("mobile").toString());
//        user.setEmail(userData.get("email").toString());
        ZenUserKit.updateNick(uid, userData.get("name").toString());
        this.uploaderService.avator(userData.get("avatar").toString(), uid);
    }

    public ZenUser getUser(String code) {
        String token = token();
        Map<String, Object> data = HttpKit.getAsMap(USERINFO_URL, ZenData.create("access_token", token).put("code", code));
        if (!data.get("errcode").equals(SUCCESS_STATUS)) {
            log.error("wechatUserInfoError", data);
            return null;
        }
        String userKey = "UserId";
        if (!data.containsKey(userKey)) {
            return null;
        }
        String wechatUserId = data.get(userKey).toString();
        // 本地已存在，则直接返回
        ZenUser user = ZenUserKit.getByUnionId(wechatUserId, ZenRole.WECHAT);
        if (user != null) {
            return user;
        }
        Map<String, Object> userData = HttpKit.getAsMap(USER_DETAIL_URL, ZenData.create("access_token", token).put("userid", wechatUserId));
        if (!userData.get("errcode").equals(SUCCESS_STATUS)) {
            log.error("wechatUserDetailError", userData);
            return null;
        }
        String uid = StringKit.objectId();
        user = new ZenUser();
        user.setUid(uid);
        user.setUsername(userData.get("userid").toString());
        user.setNick(userData.get("name").toString());
        user.setTag(ZenRole.WECHAT.tagValue());
        user.setUnionId(wechatUserId);
        user.setMobile(userData.get("mobile").toString());
        user.setEmail(userData.get("email").toString());
        ZenUserKit.insert(user);
        this.uploaderService.avator(userData.get("avatar").toString(), uid);
        return user;
    }
}
