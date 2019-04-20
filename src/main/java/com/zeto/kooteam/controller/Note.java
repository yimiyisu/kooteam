package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.ZenUserKit;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenCondition;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;

@AccessRole
public class Note {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    //  我的文库
    public ZenResult my(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("select/noteUserByUid", data, user);
        String[] params = new String[]{"permission"};
        ZenResult notes = zenStorageEngine.selectByIds("note", "noteId", result, params);
        ZenCondition zenCondition = ZenConditionKit.And().eq("uid", user.getUid());
        long total = zenStorageEngine.count("noteUser", zenCondition);
        return ZenResult.success().put("data", notes.getData()).put("total", total);
    }

    public ZenResult get(ZenData data, ZenUser user) {
        ZenResult note = zenStorageEngine.execute("get/note", data, user);
        if (note.isEmpty()) {
            return ZenResult.success();
        }
        ZenResult extend = zenStorageEngine.extend("note", data.get("_id"));
        note.put("content", extend.get("content"));
        return note;
    }

    public ZenResult patch(ZenData data, ZenUser user) {
        zenStorageEngine.execute("patch/note", data, user);
        return ZenResult.success().setData("保存成功");
    }

    public ZenResult graph(ZenData data, ZenUser user) {
        ZenData params = ZenData.put("_id", data.get("filename"))
                .set("content", data.get("xml"));
        zenStorageEngine.execute("patch/note", params, user);
        return ZenResult.success("保存成功！");
    }

    private static final String docType = "4";

    public ZenResult add(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("put/note", data, user);
        if (docType.equals(data.get("type"))) {
            ZenData param = ZenData.put("noteId", result.get("_id")).
                    set("uid", user.getUid()).
                    set("op", user.getUid()).
                    set("permission", "3");
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
        zenStorageEngine.execute("delete/noteUser", data, user);
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

    public ZenResult users(ZenData data, ZenUser user) {
        ZenResult users = zenStorageEngine.execute("select/noteUser", data, user);
        return ZenUserKit.selectByUids(users, "uid");
    }
}
