package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.Data;

@Data
public class FeishuUserInfoRes {
    private Integer code;
    private String msg;
    private FeishuUserInfo data;

    @Data
    public static class FeishuUserInfo {
        private String name;
        private String avatar_url;
        private String open_id;
        private String union_id;
        private String user_id;
        private String mobile;
        private String email;
    }
}
