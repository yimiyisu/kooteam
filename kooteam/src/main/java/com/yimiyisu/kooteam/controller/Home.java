package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.kit.OpenPlatformKit;
import com.yimiyisu.kooteam.kit.openPlatform.IOpenPlatform;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.domain.ZenUser;
import com.zen.enums.ZenRole;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@AccessRole(ZenRole.SIGNATURE)
public class Home extends ZenController {
    @Inject
    private ZenEngine zenEngine;

    public ZenResult token() {
        return ZenResult.redirect("/home.html");
    }

    public ZenResult test(ZenData data) {
        ZenUser user = data.getUser();
        OpenPlatformKit.completeUser(user);
        return ZenResult.success();
    }


    // 获取当前用户的默认首页
    private String getHomePage(ZenUser user) {
        return "/home.xhtm#/todoIndex";
    }
}
