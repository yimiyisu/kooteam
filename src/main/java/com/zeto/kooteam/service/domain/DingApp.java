package com.zeto.kooteam.service.domain;

import lombok.Data;

@Data
public class DingApp {
    private String secret;
    private String corpId;
    private String host;
    private Long agentId;
}
