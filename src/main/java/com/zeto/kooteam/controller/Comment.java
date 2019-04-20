package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.ZenUserKit;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;

@AccessRole
public class Comment {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    public ZenResult selectByParent(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("select/commentByTargetId", data, user);
        result = ZenUserKit.selectByUids(result, "uid");
        return result;
    }
}
