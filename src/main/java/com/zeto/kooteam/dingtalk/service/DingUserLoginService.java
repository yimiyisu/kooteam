package com.zeto.kooteam.dingtalk.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.StringKit;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiUserGetuserinfoRequest;
import com.dingtalk.api.response.OapiUserGetResponse;
import com.dingtalk.api.response.OapiUserGetuserinfoResponse;
import com.taobao.api.ApiException;
import com.zeto.dal.UserMapper;
import com.zeto.dal.domain.UserFrom;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenLoggerEngine;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.service.UploaderService;

@Bean
public class DingUserLoginService {
    @Inject
    private ZenLoggerEngine zenLoggerEngine;

    @Inject
    private ZenStorageEngine zenStorageEngine;

    @Inject
    private DingUserService dingUserService;

    @Inject
    private UploaderService uploaderService;

    private static final int userCacheTime = 7200;

    public ZenUser getUserByAuthCode(String authCode) {
        String accessToken = DingClient.getToken();
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/user/getuserinfo");
        OapiUserGetuserinfoRequest request = new OapiUserGetuserinfoRequest();
        request.setCode(authCode);
        request.setHttpMethod("GET");
        ZenUser user;
        try {
            OapiUserGetuserinfoResponse response = client.execute(request, accessToken);
            String unionId = response.getUserid();
            user = UserMapper.i().getByUnionId(unionId, UserFrom.DINGTALK);
            if (user == null) {
                user = this.addUser(unionId);
            } else {
//                user = UserMapper.i().updateUkey(user.getUid());
            }
            return user;
        } catch (ApiException e) {
            zenLoggerEngine.exception(e);
        }
        return null;
    }

    private ZenUser addUser(String unionId) {
        String uid = StringKit.objectId();
        OapiUserGetResponse dingUser = dingUserService.get(unionId);
        ZenUser user = new ZenUser();
        user.setUid(uid);
        user.setNick(dingUser.getName());
        user.setFrom(UserFrom.DINGTALK.getValue());
        user.setUkey(uid);
        user.setUnionId(unionId);
        UserMapper.i().insert(user);
        uploaderService.avator(dingUser.getAvatar(), uid);
        return user;
    }
}
