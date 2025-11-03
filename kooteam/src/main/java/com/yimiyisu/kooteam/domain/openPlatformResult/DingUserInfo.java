package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.Data;

@Data
public class DingUserInfo {
    private Integer errcode;
    private DingUserInfoResult result;
    private String errmsg;
    private String request_id;

    @Data
    public static class DingUserInfoResult {
        private String unionid;
        private String associated_unionid;
        private String device_id;
        private int sys_level;
        private String name;
        private boolean sys;
        private String userid;
        private int contact_type;
    }
}
