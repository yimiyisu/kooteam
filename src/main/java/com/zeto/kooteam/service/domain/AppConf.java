package com.zeto.kooteam.service.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class AppConf {
    public static final String cacheKey = "initConfig";
    private static final String MYSQL_KEY = "mysql";
    private boolean dbCheck = false;
    private String dbType;
    private String host;
    private String database;
    private String user;
    private String password;
    private String rootPwd;
    private String port;

    public boolean isMysql() {
        return MYSQL_KEY.equals(dbType);
    }
}
