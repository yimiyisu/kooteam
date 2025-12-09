package com.yimiyisu.kooteam.domain.openPlatformAccessToken;

import lombok.Data;

@Data
public class DingTokenRes {
    private long expireln; // 过期时间
    private String accessToken; // token
    private String refreshToken; // 用于刷新token
}
