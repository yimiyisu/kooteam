package com.zeto.kooteam.service.auth.ding;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.HttpKit;
import com.blade.kit.StringKit;
import com.google.common.base.Strings;
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
public class DingClient implements Client {
    private String corpId;
    private String agentId;
    private String secret;
    private static final String TOKEN_URL = "https://oapi.dingtalk.com/gettoken";
    private static final String USERINFO_URL = "https://oapi.dingtalk.com/user/getuserinfo";
    private static final String USER_DETAIL_URL = "https://oapi.dingtalk.com/user/get";
    private static final String TOKEN_KEY = "access_token";
    private static final Integer SUCCESS_STATUS = 0;
    @Inject
    private UploaderService uploaderService;

    public void init(String key) {
        corpId = ConfigKit.getByApp(key, "ddCorpid");
        agentId = ConfigKit.getByApp(key, "ddKey");
        secret = ConfigKit.getByApp(key, "ddSecret");
    }

    private String token() {
        String token = ZenCache.get(TOKEN_KEY);
        if (token != null) {
            return token;
        }
        Map<String, Object> data = HttpKit.getAsMap(TOKEN_URL, ZenData.create("appkey", agentId).put("appsecret", secret));
        if (!data.get("errcode").equals(SUCCESS_STATUS)) {
            log.error("DingTokenError", data);
            return null;
        }
        token = data.get(TOKEN_KEY).toString();
        if (Strings.isNullOrEmpty(token)) {
            return null;
        }
        ZenCache.set(TOKEN_KEY, token, 100);
        return token;
    }

    public String check() {
        Map<String, Object> data = HttpKit.getAsMap(TOKEN_URL, ZenData.create("appkey", agentId).put("appsecret", secret));
        if (!data.get("errcode").equals(SUCCESS_STATUS)) {
            return data.get("errcode") + "-" + data.get("errmsg");
        }
        return null;
    }

    public ZenResult params(String checkId) {
        return ZenResult.success()
                .put("url", "/ding.html?corpId=" + corpId + "&checkId=" + checkId)
                .put("checkId", checkId);
    }

    public ZenUser getUser(String code) {
        String token = token();
        Map<String, Object> data = HttpKit.getAsMap(USERINFO_URL, ZenData.create("access_token", token).put("code", code));
        if (!data.get("errcode").equals(SUCCESS_STATUS)) {
            log.error("dingUserInfoError", data);
            return null;
        }
        String userKey = "userid";
        if (!data.containsKey(userKey)) {
            return null;
        }
        String userId = data.get(userKey).toString();
        // 本地已存在，则直接返回
        ZenUser user = ZenUserKit.getByUnionId(userId, ZenRole.DING);
        if (user != null) {
            return user;
        }
        // 获取用户详细信息，需要应用独立授权，暂时取消
//        Map<String, Object> userData = HttpKit.getAsMap(USER_DETAIL_URL, ZenData.create("access_token", token).put("userid", userId));
//        if (!userData.get("errcode").equals(SUCCESS_STATUS)) {
//            log.error("dingUserDetailError", userData);
//            return null;
//        }
        String uid = StringKit.objectId();
        user = new ZenUser();
        user.setUid(uid);
//        user.setUsername(userData.get("userid").toString());
        user.setNick(data.get("name").toString());
        user.setTag(ZenRole.DING.tagValue());
        user.setUnionId(userId);
//        user.setMobile(userData.get("mobile").toString());
//        user.setEmail(userData.get("email").toString());
        ZenUserKit.insert(user);
//        this.uploaderService.avator(userData.get("avatar").toString(), uid);
        return user;
    }

    public void updateUser(String unionId) {
        ZenUser user = ZenUserKit.getByUnionId(unionId, ZenRole.DING);
        if (user == null) {
            return;
        }
        String token = this.token(), uid = user.getUid();
        Map<String, Object> userData = HttpKit.getAsMap(USER_DETAIL_URL, ZenData.create("access_token", token).put("userid", unionId));
        if (!userData.get("errcode").equals(SUCCESS_STATUS)) {
            log.error("dingUserDetailError", userData);
            return;
        }
        ZenUserKit.updateNick(uid, userData.get("name").toString());
        this.uploaderService.avator(userData.get("avatar").toString(), uid);
    }


}
