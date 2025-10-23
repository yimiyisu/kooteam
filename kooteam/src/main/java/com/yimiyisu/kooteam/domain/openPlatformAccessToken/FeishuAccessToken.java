package com.yimiyisu.kooteam.domain.openPlatformAccessToken;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FeishuAccessToken {
    // 0表示成功，1表示失败
    private String code;
    // 过期时间
    private String expire;
    // 错误描述
    private String msg;
    // token
    private String app_access_token;
    private String tenant_access_token;
}
