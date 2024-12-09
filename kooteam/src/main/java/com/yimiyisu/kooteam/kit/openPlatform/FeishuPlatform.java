package com.yimiyisu.kooteam.kit.openPlatform;

import com.zen.domain.ZenUser;


public class FeishuPlatform implements IOpenPlatform {
    @Override
    public void refreshToken() {

    }

    @Override
    public void completeUser(ZenUser user) {

    }

    public String getAccessToken() {
        return "";
    }

    @Override
    public String sendMessage(ZenUser to, String content) {
        return "";
    }
}
