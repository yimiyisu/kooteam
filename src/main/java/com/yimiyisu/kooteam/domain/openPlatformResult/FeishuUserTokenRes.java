package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.Data;

@Data
public class FeishuUserTokenRes {
    private Integer code;
    private String access_token;
    private String refresh_token;
    private String scope;
    private long expires_in;
    private String token_type;
    private long refresh_token_expires_in;
}
