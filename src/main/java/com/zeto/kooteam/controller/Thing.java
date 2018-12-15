package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.google.common.base.Strings;
import com.zeto.ZenCondition;
import com.zeto.ZenConditioner;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenLoggerEngine;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.init.TodoInit;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.eventbus.model.MessageModel;
import com.zeto.kooteam.service.eventbus.model.MessageType;
import org.bson.types.ObjectId;


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
            data.add("size", "200");
        }
        ZenResult result = zenStorageEngine.execute(path, data, user);
        if (result.isEmpty()) {
            ObjectId objectId = new ObjectId(user.getUid());
            long regTime = objectId.getDate().getTime() / 1000 + 24 * 360;
            int now = DateKit.now();
            // 注册时间在一天以内的用户，帮助初始化数据
            if (regTime > now) {
                // 初始化数据
                todoInit.execute(user);
                EventBiz.userInit(user);
                return this.latest(data, user);
            }
        }
        return result;
    }

    public ZenResult get(ZenData data, ZenUser user) {
        ZenResult thing = zenStorageEngine.execute("get/thingById", data, user);
        if (thing.isEmpty()) {
            return thing;
        }
        ZenResult extend = zenStorageEngine.extend("thing", data.get("_id"));
        if (!extend.isEmpty()) {
            thing.put("content", extend.get("content"));
        }
        String ownerId = thing.get("owner");
        if (user.getUid().equals(ownerId)) {
            thing.put("nick", user.getNick());
        } else {
            ZenUser current = UserMapper.i().get(ownerId);
            thing.put("nick", current.getNick());
        }
        return thing;
    }

    public ZenResult put(ZenData data, ZenUser user) {
        String owner = data.get("owner");
        if (Strings.isNullOrEmpty(owner)) {
            data.add("owner", user.getUid());
        }
        String start = data.get("start");
        if (Strings.isNullOrEmpty(start)) {
            start = DateKit.now().toString();
        }
        data.add("start", start);
        data.add("order", start);
        ZenResult result = zenStorageEngine.execute("put/thing", data, user);
        // 给别人发送任务，需要发送消息通知
        if (!user.getUid().equals(owner) && !Strings.isNullOrEmpty(owner)) {
            String message = user.getNick() + "给你分配了一个任务：" + data.get("title");
            EventBiz.sendMessage(new MessageModel(user.getUid(), owner, message, data.get("_id"), MessageType.THING));
        }
        // 异步更新工程统计数据
        EventBiz.projectState(data.get("projectId"));
        return result;
    }

    public ZenResult patch(ZenData data, ZenUser user) {
        ZenResult result = zenStorageEngine.execute("patch/thing", data, user);
        // 异步更新工程统计数据
        if (data.contains("status")) {
            EventBiz.projectState(data.get("projectId"));
        }
        String owner = data.get("owner");
        // 给别人发送任务，需要发送消息通知
        if (!user.getUid().equals(owner) && !Strings.isNullOrEmpty(owner)) {
            String message = user.getNick() + "转交了一个任务给你：" + data.get("title");
            EventBiz.sendMessage(new MessageModel(user.getUid(), owner, message, data.get("_id"), MessageType.THING));
        }
        return result;
    }

    public ZenResult selectByUid(ZenUser user, ZenData data) {
        ZenResult things = zenStorageEngine.execute("select/thingByUid", data, user);
        long total = zenStorageEngine.count("thing", ZenConditioner.And().eq("uid", user.getUid()));
        return ZenResult.success().put("total", total).put("data", things.getData());
    }

    public ZenResult selectByFinish(ZenUser user, ZenData data) {
        data.add("status", "1");
        ZenResult things = zenStorageEngine.execute("select/thing", data, user);
        ZenCondition condition = ZenConditioner.And().eq("uid", user.getUid()).eq("status", "1");
        long total = zenStorageEngine.count("thing", condition);
        return ZenResult.success().put("total", total).put("data", things.getData());
    }
}
