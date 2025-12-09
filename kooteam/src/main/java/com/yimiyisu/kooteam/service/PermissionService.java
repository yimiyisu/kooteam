package com.yimiyisu.kooteam.service;

import com.yimiyisu.kooteam.domain.PermissionAppDO;
import com.yimiyisu.kooteam.domain.PermissionConfigDO;
import com.yimiyisu.kooteam.domain.PermissionPageDO;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Component;
import com.zen.annotation.Inject;
import com.zen.domain.PageEntity;
import com.zen.kit.CacheKit;
import com.zen.kit.StringKit;

@Component
public class PermissionService {
    private static final String prifix = "urp:";

    private static final int CACHE_TIME = 60;

    @Inject
    private ZenEngine zenEngine;

    /**
     * 获取用户角色
     *
     * @param uid 用户ID
     * @return 权限配置
     */
    public PermissionConfigDO get(String uid) {
        String cacheKey = PermissionService.prifix + uid;
        return CacheKit.get(cacheKey, PermissionConfigDO.class);
    }

    /**
     * 获取有用权限
     *
     * @param uid     用户ID
     * @param appName 应用名
     * @return 应用权限
     */
    public PermissionAppDO get(String uid, String appName) {
        // 本地开发环境，返回所有菜单
        String cacheKey = PermissionService.prifix + uid;
        PermissionConfigDO permissionConfigDO = CacheKit.get(cacheKey, PermissionConfigDO.class);
        if (permissionConfigDO == null) permissionConfigDO = new PermissionConfigDO(uid);
        PermissionAppDO permissionAppDO = permissionConfigDO.get(appName);
        if (permissionAppDO == null) {
            // 查询用户权限
            ZenData params = ZenData.create("uid", uid).put("app", appName);
            ZenResult result = zenEngine.execute("join/role_user", params);
            if (!result.isEmpty()) {
                permissionAppDO = new PermissionAppDO();
                PageEntity<PermissionPageDO> pageEntity = result.asPageEntity(PermissionPageDO.class);
                for (PermissionPageDO pageDO : pageEntity.getList()) {
                    permissionAppDO.addPages(pageDO.getPermissionsLeft());
                    permissionAppDO.addPoints(pageDO.getPointsLeft());
                }
                permissionConfigDO.set(appName, permissionAppDO);
                CacheKit.set(PermissionService.prifix + uid, permissionConfigDO, PermissionService.CACHE_TIME);
            }
        }
        return permissionAppDO;
    }

    /**
     * 删除角色缓存
     *
     * @param uid 用户ID
     */
    public void remove(String uid, String appName) {
        if (StringKit.isEmpty(appName)) CacheKit.remove(PermissionService.prifix + uid);
        else {
            PermissionConfigDO permissionConfigDO = this.get(uid);
            if (permissionConfigDO == null) return;
            if (permissionConfigDO.get(appName) == null) return;
            permissionConfigDO.remove(appName);
            CacheKit.set(PermissionService.prifix + uid, permissionConfigDO, PermissionService.CACHE_TIME);
        }
    }
}
