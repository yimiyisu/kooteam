package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.EncryptKit;
import com.blade.kit.StringKit;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.ZenUserKit;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenSiteUser;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kit.SiteKit;

@AccessRole
public class User {
    @Inject
    private ZenStorageEngine zenStorageEngine;


    private static final String rootName = "kooteam";

    public ZenResult delete(ZenUser user, ZenData data) {
        if (!user.hasTag(ZenRole.ADMIN)) {
            return ZenResult.noPermision();
        }
        String id = data.get("_id");
        ZenUser userProfile = ZenUserKit.get(id);
        if (userProfile == null) {
            return ZenResult.fail("用户不存在");
        }
        if (userProfile.hasTag(ZenRole.ADMIN)) {
            return ZenResult.fail("请先取消管理员身份再删除");
        }
        if (ZenEnvironment.isCloudApp()) {
            String siteId = user.siteId();
            SiteKit.quit(id, siteId);
        } else {
            ZenUserKit.delete(id);
        }
        return ZenResult.success();
    }

    // 查询申请的用户列表
    public ZenResult approve(ZenData data, ZenUser user) {
        return SiteKit.selectUsersByRole(user.siteId(), ZenRole.APPLICANT);
    }

    // 同事列表
    public ZenResult list(ZenData data, ZenUser user) {
        int page = data.getInt("page"), size = 20;
        ZenResult result = ZenResult.success();
        if (ZenEnvironment.isCloudApp()) {
            String siteId = user.siteId();
            result.setList(SiteKit.selectBySiteId(siteId, page));
            result.setTotal(SiteKit.countBySiteId(siteId));
        } else {
            result.setList(ZenUserKit.select(page, size));
            result.setTotal(ZenUserKit.count());
        }
        return result;
    }

    // 同意用户加入
    public ZenResult aggree(ZenData data, ZenUser user) {
        if (!user.hasTag(ZenRole.ADMIN)) {
            return ZenResult.noPermision();
        }
        String uid = data.get("uid"), siteId = user.siteId();
        ZenSiteUser siteUser = SiteKit.getSiteUser(uid, siteId);
        if (siteUser == null) {
            return ZenResult.fail("用户不存在");
        }
        SiteKit.setUserTag(uid, siteId, 0 - ZenRole.APPLICANT.value());
        return ZenResult.success("审批通过");
    }

    // 不同意加入
    public ZenResult disaggree(ZenData data, ZenUser user) {
        if (!user.hasTag(ZenRole.ADMIN)) {
            return ZenResult.noPermision();
        }
        String uid = data.get("uid"), siteId = user.siteId();
        SiteKit.quit(uid, siteId);
        return ZenResult.fail("拒绝成功");
    }

    //手动添加用户
    public ZenResult addUser(ZenData data, ZenUser user) {
        if (!user.hasTag(ZenRole.ADMIN)) {
            return ZenResult.noPermision();
        }
        String username = data.get("username");
        if (ZenUserKit.getByName(username) != null) {
            return ZenResult.fail("添加失败，该用户名已存在！");
        }
        ZenUser newUser = new ZenUser();
        newUser.setUid(StringKit.objectId());
        newUser.setUsername(data.get("username"));
        newUser.setNick(data.get("nick"));
        newUser.setPwd(EncryptKit.md5(data.get("pwd")));
        ZenUserKit.insert(newUser);
        return ZenResult.success();
    }

    public ZenResult getById(ZenData data) {
        ZenUser user = ZenUserKit.get(data.get("uid"));
        if (user == null) {
            return ZenResult.success();
        }
        return ZenResult.success().put("nick", user.getNick());
    }
}
