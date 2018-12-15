package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.EncryptKit;
import com.blade.kit.StringKit;
import com.google.common.base.Strings;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.dingtalk.service.DingDepartmentService;
import com.zeto.kooteam.service.EventBiz;

import java.util.List;

@AccessRole
public class User {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    @Inject
    private DingDepartmentService dingDepartmentService;

    private static final String rootName = "root";

    public ZenResult addFriend(ZenData data, ZenUser user) {
        String fromUid = data.get("from");
        ZenData params = ZenData.put("userId", fromUid);
        ZenResult checkData = this.zenStorageEngine.execute("count/friend", params, user);
        if (!checkData.isEmpty()) {
            // 判断好友关系是否存在
            long count = checkData.getLong();
            if (count > 0) {
                return ZenResult.success();
            }
        }
        // 两个人相互添加好友
        ZenUser fromUser = UserMapper.i().get(fromUid);
        if (fromUser == null) {
            return ZenResult.success();
        }
        this.addFriendData(user.getUid(), fromUser);
        this.addFriendData(fromUid, user);
        return ZenResult.success();
    }

    public ZenResult deleteFriend(ZenUser user, ZenData data) {
        String uid = data.get("userId");
        if (ZenEnvironment.isPersonCloud()) {
            String myId = user.getUid();
            this.deleteFriendData(myId, uid, user);
            this.deleteFriendData(uid, myId, user);
        } else {
            if (!user.getUsername().equals(rootName)) {
                return ZenResult.fail("只有管理员才能删除");
            }
            if (user.getUid().equals(uid)) {
                return ZenResult.fail("不能删除自己");
            }
            UserMapper.i().delete(uid);
        }
        return ZenResult.success();
    }

    public ZenResult dingtalk(ZenData data) {
        EventBiz.employeeSync();
//        Long parentId = data.getLong("department", 1L);
//        DingUserResult mgBSON = dingDepartmentService.selectByParent(parentId);
        return ZenResult.success().setData("ok");
    }

    public ZenResult searchFriend(ZenUser user, ZenData data) {
        String keyword = data.get("keyword");
        int size = data.getInt("size", 10);
        // 本地应用，直接查询数据库
        if (!ZenEnvironment.isPersonCloud()) {
            List<ZenUser> users = UserMapper.i().search(keyword, size);
            return ZenResult.success().setData(users);
        }
        ZenCondition condition = ZenConditioner.And().eq("myId", user.getUid());
        //加入模糊查询条件
        if (!Strings.isNullOrEmpty(keyword)) {
            keyword = keyword.trim();
            condition.like("nick", keyword);
        }
        return zenStorageEngine.select("friend", condition, size);
    }

    public ZenResult friend(ZenData data, ZenUser user) {
        long total;
        ZenResult result;
        if (ZenEnvironment.isPersonCloud()) {
            result = zenStorageEngine.execute("select/friend", data, user);
            ZenCondition condition = ZenConditioner.And().eq("myId", user.getUid());
            total = zenStorageEngine.count("friend", condition);
        } else {
            result = zenStorageEngine.execute("select/user", data, user);
            total = zenStorageEngine.count("user");
        }
        return ZenResult.success().put("data", result.getData()).put("total", total).put("isPerson", ZenEnvironment.isPersonCloud());
    }

    public ZenResult addUser(ZenData data, ZenUser user) {
        if (!user.getUsername().equals(rootName)) {
            return ZenResult.fail("只有管理员才能添加用户");
        }
        String username = data.get("username");
        if (UserMapper.i().getByName(username) != null) {
            return ZenResult.fail("添加失败，该用户名已存在！");
        }
        ZenUser newUser = new ZenUser();
        newUser.setUid(StringKit.objectId());
        newUser.setUsername(data.get("username"));
        newUser.setNick(data.get("nick"));
        newUser.setPwd(EncryptKit.md5(data.get("pwd")));
        newUser.setUkey("");
        UserMapper.i().insert(newUser);
        return ZenResult.success();
    }

    public ZenResult getById(ZenData data) {
        ZenUser user = UserMapper.i().get(data.get("uid"));
        if (user == null) {
            return ZenResult.success();
        }
        return ZenResult.success().put("nick", user.getNick());
    }

    private void addFriendData(String myId, ZenUser user) {
        ZenData params = ZenData.put("userId", user.getUid());
        params.add("myId", myId);
        params.add("nick", user.getNick());
        zenStorageEngine.execute("put/friend", params, user);
    }

    private void deleteFriendData(String myId, String userId, ZenUser user) {

        ZenData param = ZenData.put("myId", myId).add("userId", userId);
        ZenResult result = zenStorageEngine.execute("get/friend", param, user);
        if (result.isEmpty()) {
            return;
        }
        param = ZenData.put("_id", result.get("_id"));
        zenStorageEngine.execute("delete/friend", param, user);
    }
}
