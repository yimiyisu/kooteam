package com.yimiyisu.kooteam.kit.openPlatform;

import com.zen.domain.ZenUser;

public class DefaultPlatform implements IOpenPlatform {
    @Override
    public void refreshToken() {

    }

    @Override
    public void completeUser(ZenUser user) {

    }

    @Override
    public String sendMessage(ZenUser to, String content) {
        return "";
    }
}
