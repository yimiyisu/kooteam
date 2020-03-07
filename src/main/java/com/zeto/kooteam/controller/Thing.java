package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.google.common.base.Strings;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.ZenUserKit;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenCondition;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenLoggerEngine;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.init.TodoInit;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.eventbus.model.MessageModel;
import com.zeto.kooteam.service.eventbus.model.MessageType;
import org.bson.types.ObjectId;

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
        if (result.isEmpty()) {
            ObjectId objectId = new ObjectId(user.getUid());
            long regTime = objectId.getDate().getTime() / 1000 + 24 * 360;
            long now = DateKit.now();
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
            ZenUser current = ZenUserKit.get(ownerId);
            if (current != null) {
                thing.put("nick", current.getNick());
            }
        }
        return thing;
    }

    public ZenResult archive_get(ZenData data, ZenUser user) {
        ZenResult thing = zenStorageEngine.execute("get/archiveById", data, user);
        if (thing.isEmpty()) {
            return thing;
        }
        ZenResult extend = zenStorageEngine.extend("archive", data.get("_id"));
        if (!extend.isEmpty()) {
            thing.put("content", extend.get("content"));
        }
        String ownerId = thing.get("owner");
        if (user.getUid().equals(ownerId)) {
            thing.put("nick", user.getNick());
        } else {
            ZenUser current = ZenUserKit.get(ownerId);
            if (current != null) {
                thing.put("nick", current.getNick());
            }
        }
        return thing;
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

    // 归档
    public ZenResult archive(ZenData data, ZenUser user) {
        Map<String, Object> thing = zenStorageEngine.execute("get/thingById", data, user).getMap();
        ZenData param = new ZenData();
        for (String key : thing.keySet()) {
            param.put(key, thing.get(key));
        }
        ZenResult result = zenStorageEngine.execute("put/archive", param, user);
        zenStorageEngine.execute("delete/thing", data, user);
        return result;
    }

    // 恢复任务
    public ZenResult recoverThing(ZenData data, ZenUser user) {
        Map<String, Object> thing = zenStorageEngine.execute("get/archiveById", data, user).getMap();
        ZenData param = new ZenData();
        for (String key : thing.keySet()) {
            param.put(key, thing.get(key));
        }
        ZenResult result = zenStorageEngine.execute("put/thingAdd", param, user);
        zenStorageEngine.execute("delete/archive", data, user);
        return result;
    }

    public ZenResult deleteArchive(ZenData data, ZenUser user) {
        ZenCondition condition = ZenConditionKit.Or().eq("_id", data.get("_id"));
        // 删除归档
        zenStorageEngine.delete("archive", condition);
        ZenCondition logCondition = ZenConditionKit.Or().eq("thingId", data.get("_id"));
        // 删除操作日志
        zenStorageEngine.delete("thingLog", logCondition);
        // 删除关注人
        zenStorageEngine.delete("thingWatcher", logCondition);
        return ZenResult.success();
    }

    // 删除清单
    public ZenResult removeThing(ZenData data, ZenUser user) {
        ZenCondition condition = ZenConditionKit.Or().eq("_id", data.get("id"));
        ZenCondition condition1 = ZenConditionKit.Or().eq("parentId", data.get("id"));
        zenStorageEngine.delete("childThing", condition);
        zenStorageEngine.delete("childThing", condition1);
        return ZenResult.success();
    }

    public ZenResult selectByUid(ZenUser user, ZenData data) {
        ZenResult things = zenStorageEngine.execute("select/thingByUid", data, user);
        long total = zenStorageEngine.count("thing", ZenConditionKit.And().eq("uid", user.getUid()));
        return ZenResult.success().put("total", total).put("list", things.getData());
    }

    public ZenResult selectByFinish(ZenUser user, ZenData data) {
        data.put("status", "1");
        ZenResult things = zenStorageEngine.execute("select/thing", data, user);
        ZenCondition condition = ZenConditionKit.And().eq("uid", user.getUid()).eq("status", 1);
        long total = zenStorageEngine.count("thing", condition);
        return ZenResult.success().put("total", total).put("data", things.getData());
    }

    public ZenResult remove(ZenUser user, ZenData data) {
        String id = data.get("_id"), uid = user.getUid();
        ZenResult result = zenStorageEngine.get("thing", id);
        if (result.isEmpty()) {
            return ZenResult.fail("找不到该任务");
        }
        if (!uid.equals(result.get("uid")) && !uid.equals(result.get("owner"))) {
            return ZenResult.fail("你无权删除任务");
        }
        data.put("uid", result.get("uid"));
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
