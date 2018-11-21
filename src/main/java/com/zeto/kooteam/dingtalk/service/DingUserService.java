package com.zeto.kooteam.dingtalk.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiUserGetRequest;
import com.dingtalk.api.response.OapiUserGetResponse;
import com.taobao.api.ApiException;
import com.zeto.driver.ZenLoggerEngine;
import com.zeto.kooteam.dingtalk.DingClient;

@Bean
public class DingUserService {

    @Inject
    private ZenLoggerEngine zenLoggerEngine;

    public OapiUserGetResponse get(String dingId, String accessToken) {
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/user/get");
        OapiUserGetRequest request = new OapiUserGetRequest();
        request.setUserid(dingId);
        request.setHttpMethod("GET");
        try {
            return client.execute(request, accessToken);
        } catch (ApiException e) {
            zenLoggerEngine.exception(e);
        }
        return null;
    }

    public OapiUserGetResponse get(String dingId) {
        String accessToken = DingClient.getToken();
        return get(dingId, accessToken);
    }
}
