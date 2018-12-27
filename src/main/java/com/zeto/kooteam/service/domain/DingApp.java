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
}
