package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.zeto.ZenCondition;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;

@AccessRole(ZenRole.NORMAL)
// 文档查看
public class View {
    @Inject
    private ZenStorageEngine zenStorageEngine;
    private static final String error = "私有文档，您无权限查看";

    // 文档内容
    public ZenResult content(ZenData data, ZenUser user) {
        ZenResult content = zenStorageEngine.execute("get/note", data, null);
        ZenResult extend = zenStorageEngine.extend("note", data.get("_id"));
        content.put("content", extend.get("content"));
        if (content.getLong("type") == 4L || data.contains("only")) {
            return content;
        }

        String parentId = content.get("parentId");
        ZenResult nav = zenStorageEngine.get("note", parentId);
        // 私有文库
        String privateType = "1";
        if (privateType.equals(nav.get("permision"))) {
            if (user == null) {
                return ZenResult.fail(error);
            }
            ZenCondition condition = ZenCondition.And().eq("uid", user.getUid()).eq("noteId", parentId);
            long count = zenStorageEngine.count("noteUser", condition);
            if (count < 1) {
                return ZenResult.fail(error);
            }
        }

        ZenResult navContent = zenStorageEngine.extend("note", parentId);
        content.put("nav", navContent.get("content"));
        content.put("navTitle", nav.get("title"));
        return content;
    }
}
