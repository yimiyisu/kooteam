package com.zeto.kooteam.dingtalk.service;

import com.blade.ioc.annotation.Bean;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiUserGetRequest;
import com.dingtalk.api.response.OapiUserGetResponse;
import com.taobao.api.ApiException;
import com.zeto.kooteam.dingtalk.DingClient;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Bean
public class DingUserService {


    public OapiUserGetResponse get(String dingId, String accessToken) {
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/user/get");
        OapiUserGetRequest request = new OapiUserGetRequest();
        request.setUserid(dingId);
        request.setHttpMethod("GET");
        try {
            return client.execute(request, accessToken);
        } catch (ApiException e) {
            log.error("", e);
        }
        return null;
    }

    public OapiUserGetResponse get(String dingId) {
        String accessToken = DingClient.getToken();
        return get(dingId, accessToken);
    }
}
