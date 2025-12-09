package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.domain.ThingDO;
import com.yimiyisu.kooteam.events.message.channels.CommonMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.yimiyisu.kooteam.events.model.ThingEmailEventModel;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.domain.MessageDO;
import com.zen.domain.ZenUser;
import com.zen.interfaces.IEvent;
import com.zen.kit.ConfigKit;
import com.zen.kit.JsonKit;
import com.zen.kit.StringKit;
import com.zen.kit.UserKit;

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
        String thingContent = thingEmailEventModel.getContent();
        String logUid = thingEmailEventModel.getLogUid();

        // 查询待办详情
        ZenResult thingResult = zenEngine.execute("get/thing", ZenData.create("id", thingId));
        if (thingResult.isEmpty()) return;
        ThingDO thing = JsonKit.parse(thingResult.getData(), ThingDO.class);

        // 获取接收人uid
        List<String> receivers = getReceivers(type, thing);
        if (receivers == null || receivers.isEmpty()) return;

        // 创建消息对象
        Map<String, Object> content = createContent(thingContent, type, logUid, from, thing.getTitle(), thingId);
        if (content == null || content.isEmpty()) return;
        MessageDO message = new MessageDO();
        message.setTo(receivers);
        message.setFrom(from);
        message.setTitle("待办任务");
        message.setContent(JsonKit.stringify(content));

        // 创建渠道信息
        ChannelInfo channelInfo = createChannel();
        if (channelInfo == null) return;

        // 发送消息
        CommonMessage commonMessage = new CommonMessage();
        commonMessage.send(message, channelInfo);
    }

    /**
     * 构建渠道信息
     *
     * @return ChannelInfo
     */
    public ChannelInfo createChannel() {
        ChannelInfo channelInfo = new ChannelInfo();
        Map<String, String> config = new HashMap<>();

        String loginMode = ConfigKit.get("loginMode");
        switch (loginMode) {
            case "wework":
                channelInfo.setConfig(config);
                channelInfo.setMessageType("textcard");
                break;
            case "dingding":
                channelInfo.setConfig(config);
                channelInfo.setMessageType("action_card");
                break;
            case "feishu":
                channelInfo.setConfig(config);
                channelInfo.setMessageType("interactive");
                break;
            default:
                return null;
        }
        return channelInfo;
    }

    /**
     * 构建消息内容
     *
     * @param from       发送人
     * @param thingTitle 待办标题
     * @param thingId    待办id
     * @return 内容
     */
    public Map<String, Object> createContent(String logContent, int type, String logUid, String from, String thingTitle, String thingId) {
        String loginMode = ConfigKit.get("loginMode");
        Map<String, Object> content = new HashMap<>();

        // 消息体内容
        ZenUser zenUser = UserKit.get(from);
        String nick = zenUser.getNick(); // 发送人昵称
        String description = "";
        switch (type) {
            case 1, 4: // 修改负责人 , 添加子任务
                description = nick + "给你转来一个任务：" + thingTitle;
                break;
            case 2: // 修改任务状态 - 通知负责人以及关注任务的人
                description = "任务：" + thingTitle + "，状态被修改(" + UserKit.get(logUid).getNick() + logContent + ")";
                break;
            case 3: // 添加@评论 - 通知@对象
                int i = 0;
                break;
            default:
                description = "任务提醒: " + thingTitle;
        }

        String url = ConfigKit.get("appDomain") + "/wap.html#/task/detail?id=" + thingId;
        String urlEncode = StringKit.urlEncode(url);

        // 根据不同登录方式构建消息内容
        switch (loginMode) {
            case "wework":
                content.put("title", "任务提醒");
                content.put("description", description);
                String weworkDetailUrl = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" + ConfigKit.get("weworkId") + "&redirect_uri=" + urlEncode + "&response_type=code&scope=snsapi_base&agentid=" + ConfigKit.get("weworkAppId") + "&state=wework#wechat_redirect";
                content.put("url", weworkDetailUrl);
                break;
            case "dingding":
                content.put("single_url", "URL");
                content.put("single_title", "查看详情");
                content.put("title", "任务提醒");
                content.put("markdown", description);
                break;
            case "feishu":
                content.put("type", "template");
                Map<String, Object> data = new HashMap<>();
                data.put("template_id", "AAqhBiWnPN23h");
                content.put("data", data);
                Map<String, String> templateVariable = new HashMap<>();
                templateVariable.put("title", "任务提醒");
                templateVariable.put("content", description);
                templateVariable.put("url", "https://accounts.feishu.cn/open-apis/authen/v1/authorize?client_id=" + ConfigKit.get("feishuAppId") + "&response_type=code&redirect_uri=" + urlEncode + "&state=feishu");
                data.put("template_variable", templateVariable);
                break;
            default:
                return null;
        }
        return content;
    }

    // 根据任务状态构建消息content
    private String createDescription(int type, String thingTitle, String description, String logContent) {
        String content = "";
        switch (type) {
            case 1, 4: // 修改负责人 , 添加子任务
                content = description;
                break;
            case 2: // 修改任务状态 - 通知负责人以及关注任务的人
                content = "任务：" + thingTitle + "状态被修改(" + logContent + ")";
                break;
            case 3: // 添加@评论 - 通知@对象
                int i = 0;
                break;
        }
        return content;
    }

    /**
     * 获取接收者集合
     *
     * @param type  操作类型
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
            case 2: // 修改任务状态 - 通知创建人/负责人以及关注任务的人
                String owner2 = thing.getOwner();
                List<String> watchers = thing.getWatchers() == null ? new ArrayList<>() : thing.getWatchers();
                receivers.addAll(watchers);
                receivers.add(owner2);
                receivers.add(thing.getCreateUid());
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
     *
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
