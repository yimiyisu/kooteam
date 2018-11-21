package com.zeto.kooteam.service.domain;

import lombok.Data;

@Data
public class DingApp {
    private String name = "kooteam";
    private String appId;
    private Long agentId;
    private String corpId;
}
