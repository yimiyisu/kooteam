package com.yimiyisu.kooteam.kit;

import com.yimiyisu.kooteam.kit.openPlatform.DefaultPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.DingdingPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.IOpenPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.WeworkPlatform;
import com.zen.domain.ZenUser;
import com.zen.kit.ConfigKit;

public class OpenPlatformKit {
    private static IOpenPlatform openPlatform = null;

    public static IOpenPlatform i() {
        if (OpenPlatformKit.openPlatform == null) {
            String platForm = ConfigKit.get("loginMode");
            if (platForm == null) return new DefaultPlatform();
            if (platForm.equals("dingding")) OpenPlatformKit.openPlatform = new DingdingPlatform();
            if (platForm.equals("wework")) {
                openPlatform = new WeworkPlatform();
            } else if (platForm.equals("feishu")) {
                openPlatform = new WeworkPlatform();
            } else {
                openPlatform = new DefaultPlatform();
            }
        }
        return OpenPlatformKit.openPlatform;
    }

    /*
    补全平台登录用户基本信息
     */
    public static void completeUser(ZenUser user) {
        i().completeUser(user);
    }

}
