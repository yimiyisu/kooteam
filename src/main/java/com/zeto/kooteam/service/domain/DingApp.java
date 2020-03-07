package com.zeto.kooteam.service.domain;

import lombok.Data;

@Data
public class DingApp {
    private String secret;
    private String appKey;
    private String name;
    private Long agentId;
    private String homeUrl;
    private String corpId;

    /*
    校验配置信息是否正确
     */
    public boolean check() {
        return false;
    }
}
