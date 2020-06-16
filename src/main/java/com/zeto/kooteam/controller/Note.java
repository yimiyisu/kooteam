package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenAction;
import com.zeto.domain.ZenCondition;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.EventBiz;

@AccessRole
public class Note {
    @Inject
    private ZenStorageEngine zenStorageEngine;
    private static final String docType = "4";

    // 我的文库
    public ZenResult my(ZenData data, ZenUser user) {
        // 这里要加上搜索关键字支持
//        String title = data.get("keyword");
//        if (Strings.isNullOrEmpty(title)) {
//            int page = data.getInt("page", 0), size = data.getInt("size", 20);
//            LeftJoinCondition leftCondition = ZenConditionKit.And().
//                    like("title", title).
//                    outputs("_id", "title", "type").
//                    skip(page * size).
//                    leftJoin("noteUser", "_id", "nodeId").
//                    setRight(ZenConditionKit.And().eq("uid", user.getUid()));
//            return zenStorageEngine.leftJoin("note", leftCondition);
//        }
        ZenResult result = zenStorageEngine.execute("select/noteUserByUid", data, user);
        String[] params = new String[]{"permission"};
        ZenResult notes = zenStorageEngine.selectByIds("note", "noteId", result, params);
        ZenCondition zenCondition = ZenConditionKit.And().eq("uid", user.getUid());
        long total = zenStorageEngine.count("noteUser", zenCondition);
        return ZenResult.success().put("list", notes.getData()).setTotal((int) total);
    }

    public ZenResult get(ZenData data, ZenUser user) {
        ZenResult note = zenStorageEngine.execute("get/note", data, user);
        if (note.isEmpty()) {
            return ZenResult.success();
        }
        // ZenResult extend = zenStorageEngine.extend("note", data.get("_id"));
        // note.put("content", extend.get("content"));
        return note;
    }

    public ZenResult patch(ZenData data, ZenUser user) {
        zenStorageEngine.execute("patch/note", data, user);
        ZenResult result = ZenResult.success();
        if (data.contains("title")) {
            result.put("title", data.get("title"));
        }
        EventBiz.noteBackup(data);
        return result.setAction(ZenAction.SILENT);
    }

    public ZenResult add(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("put/note", data, user);
        if (docType.equals(data.get("type"))) {
            ZenData param = ZenData.create("noteId", result.get("_id")).put("uid", user.getUid()).put("op", user.getUid())
                    .put("permission", "3");
            zenStorageEngine.execute("put/noteUser", param, user);
        }
        return ZenResult.success().setData(result.getData());
    }

    public ZenResult removeUser(ZenData data, ZenUser user) {
        ZenResult count = zenStorageEngine.execute("count/noteUserByNote", data, user);
        if (count.getLong() < 2) {
            return ZenResult.fail("删除失败，至少需要保留一个用户");
        }
        zenStorageEngine.execute("delete/noteUser", data, user);
        return ZenResult.success();
    }

    public ZenResult remove(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.get("noteUser", data.get("_id"));
        if (result.isEmpty()) {
            return ZenResult.fail("文件找不到");
        }
        String nodeId = result.get("noteId");
        result = zenStorageEngine.get("note", nodeId);
        if (user.getUid().equals(result.get("uid"))) {
            zenStorageEngine.execute("delete/noteUserByNoteId", ZenData.create("noteId", nodeId), user);
            zenStorageEngine.execute("delete/note", ZenData.create("_id", nodeId), user);
        } else {
            zenStorageEngine.execute("delete/noteUser", data, user);
        }

        return ZenResult.success();
    }

    public ZenResult addUser(ZenData data, ZenUser user) {
        ZenResult count = zenStorageEngine.execute("count/noteUser", data, user);
        if (count.getLong() > 0) {
            return ZenResult.fail("该用户已添加");
        }
        zenStorageEngine.execute("put/noteUser", data, user);
        return ZenResult.success("添加成功");
    }
}
