package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.google.common.base.Strings;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenCondition;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.domain.DocType;

@AccessRole(ZenRole.ANONYMITY)
// 文档查看
public class View {
    @Inject
    private ZenStorageEngine zenStorageEngine;
    private static final String error = "该文档您无查看权限！";

    // 文档内容
    public ZenResult content(ZenData data, ZenUser user) {
        ZenResult content = zenStorageEngine.execute("get/note", data, user);
        if (content.isEmpty()) {
            return ZenResult.fail(error);
        }
        String parentId = content.get("parentId");
        ZenResult parent = null;
        if (!Strings.isNullOrEmpty(parentId)) {
            parent = zenStorageEngine.get("note", parentId);
            if (!checkPermission(parent.get("permision"), user, parentId, parent.get("uid"))) {
                return ZenResult.fail(error);
            }
        }
        if (content.getLong("type") == 4L || data.contains("only")) {
            return content;
        }
        ZenResult navContent = zenStorageEngine.get("note", parentId);
        content.put("nav", navContent.get("content"));
        if (parent != null) {
            content.put("navTitle", parent.get("title"));
        }
        return content;
    }

    private boolean checkPermission(String type, ZenUser user, String parentId, String docUser) {
        // 开放文档
        if (type == null || type.equals(DocType.OPEN.getValue())) {
            return true;
        }
        if (user == null) {
            return false;
        }
        // 3 企业内部文档
        if (type.equals(DocType.COMPANY.getValue())) {
            // 只有是好友才能查看
            if (ZenEnvironment.isCloudApp()) {
                return zenStorageEngine.count("friend", ZenConditionKit.And().eq("myId", docUser).eq("userId", user.getUid())) > 0;
            }
        }

        // 4 项目文档
        if (type.equals(DocType.PROJECT.getValue())) {
            return zenStorageEngine.count("projectUser", ZenConditionKit.And().eq("projectId", parentId).eq("userId", user.getUid())) > 0;
        }

        // 私有文档权限判断
        ZenCondition condition = ZenConditionKit.And().eq("uid", user.getUid()).eq("noteId", parentId);
        long count = zenStorageEngine.count("noteUser", condition);
        return count > 0;
    }
}
