package com.zeto.kooteam.service.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class AppConf {
    public static final String cacheKey = "initConfig";
    private boolean dbCheck = false;
    private boolean dingCheck = false;
    private boolean wxCheck = false;
    private String domain;

    private String mongoHost;
    private String mongoDB;
    private String mongoUser;
    private String mongoPassword;
    private String mongoPort;
    private String dingCorpId;
    private String dingSecret;
    private String dingAppName = "kooteam";
    private String dingAppId;
    private long dingAgentId;
}
