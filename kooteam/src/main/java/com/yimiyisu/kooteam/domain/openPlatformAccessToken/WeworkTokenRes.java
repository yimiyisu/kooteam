package com.yimiyisu.kooteam.domain.openPlatformAccessToken;

import lombok.Data;

@Data
public class WeworkTokenRes {
    private int errcode;
    private String errmsg;
    private String access_token;
    private long expires_in;
}
