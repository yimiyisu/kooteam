package com.zeto.kooteam.dingtalk;

import com.blade.ioc.annotation.Bean;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiGettokenRequest;
import com.dingtalk.api.response.OapiGettokenResponse;
import com.google.common.base.Strings;
import com.zeto.ZenCache;
import com.zeto.ZenEnvironment;
import com.zeto.kooteam.service.domain.DingApp;
import lombok.extern.slf4j.Slf4j;

@Bean
@Slf4j
public class DingClient {
    // e app key
    //    private static final String appKey = "ding6yjcb4fqccevjq7x";
    //    private static final String appSecret = "AjT9_dq0JYLu7bTB01b9JEfRbNQnDLq7pJOLUf4ZhKjxgOXwGzDcdvVob40wS9yn";

    private static DingApp dingApp = null;
    private static final String apiURL = "https://oapi.dingtalk.com/gettoken";
    private static final String tokenCacheId = "dingTokenCache";

    public static boolean isInited() {
        return dingApp != null;
    }

    public static void init() {
        if (dingApp != null) {
            return;
        }
        if (ZenEnvironment.isNoSetup()) {
            return;
        }
        String dingName = ZenEnvironment.get("dingName");
        String corpId = ZenEnvironment.get("dingCorpId");
        String appKey = ZenEnvironment.get("dingAppKey");
        if (Strings.isNullOrEmpty(appKey) || Strings.isNullOrEmpty(dingName) || Strings.isNullOrEmpty(corpId)) {
            return;
        }
        String dingAgentId = ZenEnvironment.get("dingAgentId");
        dingApp = new DingApp();
        dingApp.setName(dingName);
        dingApp.setCorpId(corpId);
        dingApp.setHomeUrl(ZenEnvironment.get("dingHome"));
        dingApp.setAppKey(appKey);
        dingApp.setSecret(ZenEnvironment.get("dingSecret"));
        dingApp.setAgentId(Long.valueOf(dingAgentId));
    }

    public static DingApp info() {
        if (dingApp == null) {
            init();
        }
        return dingApp;
    }

    public static String getToken() {
        String token = ZenCache.get(tokenCacheId);
        if (token != null) {
            return token;
        }
        DefaultDingTalkClient client = new DefaultDingTalkClient(apiURL);
        OapiGettokenRequest request = new OapiGettokenRequest();
        request.setAppkey(dingApp.getAppKey());
        request.setAppsecret(dingApp.getSecret());
        request.setHttpMethod("GET");
        try {
            OapiGettokenResponse response = client.execute(request);
            token = response.getAccessToken();
            ZenCache.set(tokenCacheId, token, 110);// 缓存110分钟
            return token;
        } catch (Exception ex) {
            log.error("", ex);
        }
        return null;
    }
}
