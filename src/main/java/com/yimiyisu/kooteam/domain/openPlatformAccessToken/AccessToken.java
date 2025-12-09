package com.yimiyisu.kooteam.domain.openPlatformAccessToken;

import lombok.Data;

@Data
public class AccessToken {
    private String errcode;
    private String access_token;
    private String errmsg;
    private String expires_in;
}
