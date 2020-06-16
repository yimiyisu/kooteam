package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.kit.GsonKit;
import com.google.common.base.Strings;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenCondition;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenLoggerEngine;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.init.TodoInit;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.eventbus.model.MessageModel;
import com.zeto.kooteam.service.eventbus.model.MessageType;

import java.util.Map;


@AccessRole
public class Thing {
    @Inject
    private ZenStorageEngine zenStorageEngine;

    @Inject
    private ZenLoggerEngine zenLoggerEngine;

    @Inject
    private TodoInit todoInit;

    public ZenResult latest(ZenData data, ZenUser user) {
        String path = "select/thing";
        if (!data.contains("size")) {
            data.put("size", "200");
        }
        ZenResult result = zenStorageEngine.execute(path, data, user);
//        if (result.isEmpty()) {
//            ObjectId objectId = new ObjectId(user.getUid());
//            long regTime = objectId.getDate().getTime() / 1000 + 24 * 360;
//            long now = DateKit.now();
//            // 注册时间在一天以内的用户，帮助初始化数据
//            if (regTime > now) {
//                // 初始化数据
//                todoInit.execute(user);
//                EventBiz.userInit(user);
//                return this.latest(data, user);
//            }
//        }
        return result;
    }

    public ZenResult put(ZenData data, ZenUser user) {
        String owner = data.get("owner");
        if (Strings.isNullOrEmpty(owner)) {
            data.put("owner", user.getUid());
        }
        String start = data.get("start");
        if (Strings.isNullOrEmpty(start)) {
            start = DateKit.now() + "";
        }
        data.put("start", start);
        data.put("order", start);
        data.put("status", 0);
        ZenResult result = zenStorageEngine.execute("put/thing", data, user);
        // 给别人发送任务，需要发送消息通知
        if (!user.getUid().equals(owner) && !Strings.isNullOrEmpty(owner)) {
            MessageModel model = new MessageModel();
            model.setFrom(user.getUid());
            model.setTo(owner);
            model.setContent(user.getNick() + "给你分配了一个任务：" + data.get("title"));
            model.setObjectId(data.get("_id"));
            model.setMessageType(MessageType.THING);
            EventBiz.sendMessage(model);
        }
        // 异步更新工程统计数据
        EventBiz.projectState(data.get("projectId"));
        return result;
    }

    public ZenResult patch(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("patch/thing", data, user);
        // 异步更新工程统计数据
        if (data.contains("status") && data.contains("projectId")) {
            EventBiz.projectState(data.get("projectId"));
        }
        String owner = data.get("owner");
        // 给别人发送任务，需要发送消息通知
        if (!user.getUid().equals(owner) && !Strings.isNullOrEmpty(owner)) {
            MessageModel messageModel = new MessageModel();
            messageModel.setFrom(user.getUid());
            messageModel.setTo(owner);
            messageModel.setContent(user.getNick() + "转交了一个任务给你：" + data.get("title"));
            messageModel.setObjectId(data.get("_id"));
            messageModel.setMessageType(MessageType.THING);
            EventBiz.sendMessage(messageModel);
        }
        return result;
    }

    // 任务详情
    public ZenResult detail(ZenData data, ZenUser user) {
        return null;
    }

    // 归档
    public ZenResult archive(ZenData data, ZenUser user) {
        ZenResult thing = zenStorageEngine.get("thing", data.get("_id"));
        if (thing.isEmpty()) {
            return ZenResult.fail("任务不存在");
        }
        ZenData params = ZenData.create("title", thing.get("title")).
                put("content", GsonKit.stringify(thing.getData())).
                put("parentId", thing.get("parentId")).
                put("projectId", thing.get("projectId")).
                put("owner", thing.get("owner")).
                put("quadrant", thing.get("quadrant")).
                put("owner", thing.get("owner"));

        ZenResult result = zenStorageEngine.execute("put/archive", params, user);
        zenStorageEngine.execute("delete/thing", data, user);
        EventBiz.projectState(data.get("projectId"));
        return result.setMessage("归档成功");
    }

    public ZenResult archiveGet(ZenData data) {
        return ZenResult.success();
    }

    // 归档任务恢复
    public ZenResult restore(ZenData data, ZenUser user) {
        ZenResult thing = zenStorageEngine.get("archive", data.get("_id"));
        if (thing.isEmpty()) {
            ZenResult.fail("任务不存在");
        }
        Map<String, Object> thingData = GsonKit.parseMap(thing.get("content"));
        ZenData params = ZenData.parse(thingData);
        zenStorageEngine.execute("put/thingRestore", params, user);
        zenStorageEngine.execute("delete/archive", data, user);
        EventBiz.projectState(data.get("projectId"));
        return ZenResult.success("取消归档成功").setData(thingData);
    }

    public ZenResult deleteArchive(ZenData data, ZenUser user) {
        ZenCondition condition = ZenConditionKit.And().eq("_id", data.get("_id"));
        // 删除归档
        zenStorageEngine.delete("archive", condition);
        ZenCondition logCondition = ZenConditionKit.And().eq("thingId", data.get("_id"));
        // 删除操作日志
        zenStorageEngine.delete("thingLog", logCondition);
        // 删除关注人
        zenStorageEngine.delete("thingWatcher", logCondition);
        return ZenResult.success();
    }

    public ZenResult watch(ZenUser user, ZenData data) {
        data.put("userId", user.getUid());
        ZenResult source = zenStorageEngine.execute("select/thingWatcher", data, user);
        long total = zenStorageEngine.count("thingWatcher", ZenConditionKit.And().eq("uid", user.getUid()));
        ZenResult projects = zenStorageEngine.selectByIds("thing", "thingId", source);
        return ZenResult.success().put("list", projects.getData()).setTotal((int) total);
    }

    public ZenResult remove(ZenUser user, ZenData data) {
        String id = data.get("_id"), uid = user.getUid();
        ZenResult result = zenStorageEngine.get("thing", id);
        if (result.isEmpty()) {
            return ZenResult.fail("找不到该任务");
        }
        if (!uid.equals(result.get("uid")) && !uid.equals(result.get("owner"))) {
            return ZenResult.fail("只有创建人或负责人才能删除");
        }
        // 更新项目统计数据
        EventBiz.projectState(result.get("projectId"));
        zenStorageEngine.execute("delete/thing", data, user);
        return ZenResult.success();
    }

    public ZenResult addWatcher(ZenUser user, ZenData data) {
        ZenCondition condition = ZenConditionKit.And().
                eq("thingId", data.get("thingId")).eq("uid", data.get("uid"));
        long count = zenStorageEngine.count("thingWatcher", condition);
        if (count > 0) {
            return ZenResult.success("该用户已经关注");
        }
        return zenStorageEngine.execute("put/thingWatcher", data, user);
    }
}
