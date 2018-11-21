package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.google.common.base.Strings;
import com.zeto.ZenCondition;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.dingtalk.service.DingDepartmentService;
import com.zeto.kooteam.service.EventBiz;

import java.util.List;
import java.util.regex.Pattern;

@AccessRole
public class User {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    @Inject
    private DingDepartmentService dingDepartmentService;

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
        String myId = user.getUid(), uid = data.get("userId");
        this.deleteFriendData(myId, uid, user);
        this.deleteFriendData(uid, myId, user);
        return ZenResult.success();
    }

    public ZenResult dingtalk(ZenData data) {
        EventBiz.employeeSync();
//        Long parentId = data.getLong("department", 1L);
//        DingUserResult result = dingDepartmentService.selectByParent(parentId);
        return ZenResult.success().setData("ok");
    }

    public ZenResult searchFriend(ZenUser user, ZenData data) {
        String keyword = data.get("keyword");
        // 本地应用，直接查询数据库
        if (ZenEnvironment.isLocalApp()) {
            List<ZenUser> users = UserMapper.i().search(keyword, 10);
            return ZenResult.success().setData(users);
        }
        ZenCondition condition = ZenCondition.And().eq("myId", user.getUid());
        //加入模糊查询条件
        if (!Strings.isNullOrEmpty(keyword)) {
            keyword = keyword.trim();
            Pattern pattern = Pattern.compile("^.*" + keyword + ".*$", Pattern.CASE_INSENSITIVE);
            condition.like("nick", pattern);
        }
        return zenStorageEngine.select("friend", condition, 10);
    }

    public ZenResult getById(ZenData data) {
        ZenUser user = UserMapper.i().get(data.get("uid"));
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
