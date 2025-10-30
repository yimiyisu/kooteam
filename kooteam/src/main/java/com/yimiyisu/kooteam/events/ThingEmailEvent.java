package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.domain.LogType;
import com.yimiyisu.kooteam.domain.ThingDO;
import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.*;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.yimiyisu.kooteam.events.model.ThingEmailEventModel;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenMessage;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.domain.MessageDO;
import com.zen.interfaces.IEvent;
import com.zen.kit.ConfigKit;
import com.zen.kit.JsonKit;
import com.zen.kit.MessageKit;
import com.zen.kit.StringKit;

import java.util.*;

public class ThingEmailEvent implements IEvent<ThingEmailEventModel> {

    @Inject
    private ZenEngine zenEngine;

    @Override
    @Subscribe
    public void execute(ThingEmailEventModel thingEmailEventModel) {
        String thingId = thingEmailEventModel.getThingId(); // 待办id
        String from = thingEmailEventModel.getFrom(); // 发送人 - 操作人
        int type = thingEmailEventModel.getType(); // 操作类型
        String thingOriginal = thingEmailEventModel.getOriginal(); // 原始待办数据

        // 查询待办详情
        ZenResult thingResult = zenEngine.execute("get/thing", ZenData.create("id", thingId));
        if (thingResult.isEmpty()) return;
        ThingDO thing = JsonKit.parse(thingResult.getData(), ThingDO.class);

        // 获取接收人uid
        List<String> receivers = getReceivers(type, thing);
        if (receivers == null || receivers.isEmpty()) return;

        // 创建消息对象
        ZenMessage zenMessage = new ZenMessage("");
        Map<String, String> content = new HashMap<>();
        content.put("title", "待办任务");
        content.put("description", LogType.getMessageByValue(type) + "待办名：" + thing.getTitle());
        content.put("url", "URL");
        zenMessage.setContent(JsonKit.stringify(content));
        zenMessage.setFrom(from);
        zenMessage.setTitle("待办任务");
        String messageId = zenMessage.test(JsonKit.stringify(receivers));
        MessageDO messageDO = MessageKit.get(messageId);

        // 发送消息
        CommonMessage commonMessage = new CommonMessage();
        commonMessage.send(messageDO);
    }

    /**
     * 获取接收者集合
     * @param type 操作类型
     * @param thing 待办
     * @return 接收者列表
     */
    public List<String> getReceivers(int type, ThingDO thing) {
        List<String> receivers = new ArrayList<>();

        switch (type) {
            case 1: // 修改负责人 - 通知新负责人
                String owner1 = thing.getOwner();
                receivers.add(owner1);
                break;
            case 2: // 修改任务状态 - 通知负责人以及关注任务的人
                String owner2 = thing.getOwner();
                List<String> watchers = thing.getWatchers();
                receivers.addAll(watchers);
                receivers.add(owner2);
                break;
            case 3: // 添加@评论 - 通知@对象
                int i = 1;
                break;
            case 4: // 添加子任务 - 通知子任务负责人
                String sonThingOwner = getSonThing(thing.getId());
                receivers.add(sonThingOwner);
                break;
        }
        return receivers;
    }

    /**
     * 获取子任务负责人uid
     * @param thingId 父级待办id
     * @return 子任务负责人uid
     */
    public String getSonThing(String thingId) {

        ZenResult sonList = zenEngine.execute("list/thingByParent", ZenData.create("parentId", thingId));
        if (sonList.isEmpty()) return null;
        List<ThingDO> thingList = sonList.asList(ThingDO.class);

        ThingDO thing = thingList.stream().max(Comparator.comparing(ThingDO::getCreateTime)).orElse(null);
        if (thing == null) return null;
        return thing.getOwner();
    }
}
