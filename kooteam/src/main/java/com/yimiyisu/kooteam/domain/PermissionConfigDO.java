package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.HashMap;
import java.util.Map;

@Data
public class PermissionConfigDO {

    private String uid;

    private Map<String, PermissionAppDO> apps = null;

    public PermissionConfigDO() {
    }

    public PermissionConfigDO(String uid) {
        this.uid = uid;

    }

    public void set(String appName, PermissionAppDO permissionAppDO) {
        if (this.apps == null) this.apps = new HashMap<>();
        this.apps.put(appName, permissionAppDO);
    }

    public PermissionAppDO get(String appName) {
        if (this.apps != null) return this.apps.get(appName);
        return null;
    }

    public void remove(String appName) {
        this.apps.remove(appName);
    }
}
