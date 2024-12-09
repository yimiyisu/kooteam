package com.yimiyisu.kooteam.kit.openPlatform;

import com.zen.domain.ZenUser;

public interface IOpenPlatform {
    void refreshToken();

    // 补全用户个人信息
    void completeUser(ZenUser user);

    // 发送平台消息
    String sendMessage(ZenUser to, String content);
}
