package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.Data;

@Data
public class SnsUserInfo {
    private int errcode;
    private String errmsg;
    private UserInfo user_info;

    @Data
    public static class UserInfo {
        private boolean main_org_auth_high_level;
        private String nick;
        private String unionid;
        private String openid;
    }
}
