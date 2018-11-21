package com.zeto.kooteam.dingtalk.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiMicroappListRequest;
import com.dingtalk.api.response.OapiMicroappListResponse;
import com.taobao.api.ApiException;
import com.zeto.ZenCache;
import com.zeto.driver.ZenLoggerEngine;
import com.zeto.kooteam.dingtalk.DingClient;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.List;

@Bean
public class DingAppService {
    @Inject
    private ZenLoggerEngine zenLoggerEngine;

    private final static String appIdCache = "miniAppId";

    public String getKooteamAppId(String appName) {
        String appId = ZenCache.get(appIdCache);
        if (appId != null) {
            return appId;
        }
        List<OapiMicroappListResponse.Applist> apps = this.list();
        if (apps == null) {
            return null;
        }
        for (OapiMicroappListResponse.Applist app : apps) {
            if (app.getName().equals(appName)) {
                String link = app.getHomepageLink();
                try {
                    link = URLDecoder.decode(link, "utf-8");
                    link = link.substring(link.lastIndexOf("?") + 1);
                    String[] params = link.split("&");
                    for (String param : params) {
                        if (param.contains("miniAppId")) {
                            appId = param.substring(param.indexOf("=") + 1);
                            ZenCache.set(appIdCache, appId, 3600 * 1000);
                            return appId;
                        }
                    }
                } catch (UnsupportedEncodingException e) {
                    zenLoggerEngine.exception(e);
                }
            }
        }
        return null;
    }

    public List<OapiMicroappListResponse.Applist> list() {
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/microapp/list");
        OapiMicroappListRequest req = new OapiMicroappListRequest();
        try {
            OapiMicroappListResponse response = client.execute(req, DingClient.getToken());
            return response.getAppList();
        } catch (ApiException e) {
            zenLoggerEngine.exception(e);
        }
        return null;
    }
}
