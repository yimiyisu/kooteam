package com.yimiyisu.kooteam.events.message;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.events.message.channels.*;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.yimiyisu.kooteam.events.message.domain.TemplateDO;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.domain.MessageDO;
import com.zen.interfaces.IEvent;
import com.zen.kit.JsonKit;
import com.zen.kit.MessageKit;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.List;
import java.util.Map;


@Slf4j
public class MessageEvent implements IEvent<MessageDO> {
    // 消息模版缓存
    private final static Map<String, TemplateDO> templateCache = new HashMap<>();

    // 渠道配置缓存
    private final static Map<String, ChannelInfo> channelsConfig = new HashMap<>();
    @Inject
    private ZenEngine zenEngine;

    @Subscribe
    @Override
    public void execute(MessageDO message) {
        if (!MessageKit.beforeSendCheck(message.getId())) return;
        String templateName = message.getTemplateName();
        System.out.println(templateName);
        //获取模版消息的消息渠道
        TemplateDO channels = templateCache.get(templateName);
        if (channels == null) {
            ZenResult templateResult = zenEngine.execute("get/message_template", ZenData.create("name", templateName));
            //消息渠道不存在，删除消息
            if (templateResult.isEmpty()) {
                MessageKit.updateStatus(message.getId(), 3);
                return;
            }
            channels = templateResult.asEntity(TemplateDO.class);
            templateCache.put(templateName, channels);
        }
        boolean status = false;
        for (Map<String, String> channel : channels.getChannels()) {
            String channelId = channel.get("id");
            ChannelInfo channelInfo = channelsConfig.get(channelId);
            if (channelInfo == null) {
                //获取渠道配置
                ZenResult channelResult = zenEngine.execute("get/message_channel", ZenData.create("id", channel.get("channel")));
                if (channelResult.isEmpty()) {
                    // 发送失败
                    MessageKit.fail(message.getId());
                    return;
                }
                channelInfo = new ChannelInfo();
                channelInfo.setType(channelResult.getInt("type"));
                channelInfo.setMessageType(channelResult.get("messageType"));
                if (channelResult.get("configs") == null || channelResult.get("configs").isEmpty()) channelInfo.setConfig(new HashMap<>());
                else {
                    List<ChannelInfo.Config> configs = JsonKit.parseAsList(channelResult.get("configs"), ChannelInfo.Config.class);
                    channelInfo.setConfig(getConfigMap(configs));
                }
                channelsConfig.put(channelId, channelInfo);
            }
            //获取消息渠道的类型，发送相应类型的消息
            int type = channelInfo.getType();
            IMessage messageChannel;
            switch (type) {
                case 1:
                    messageChannel = null;
                    break;
                case 2:
                    messageChannel = WechatMessage.getInstance();
                    break;
                case 3:
                    messageChannel = WeworkMessage.getInstance();
                    break;
                case 4:
                    messageChannel = DingdingMessage.getInstance();
                    break;
                case 5:
                    messageChannel = FeishuMessage.getInstance();
                    break;
                case 6:
                    messageChannel = EmailMessage.getInstance();
                    break;
                default:
                    return;
            }
            //传人消息渠道的配置，发送各个渠道的消息
            if (messageChannel != null) status = messageChannel.send(message, channelInfo);
        }
        //消息发送完成，标记状态
        if (status) {
            MessageKit.finish(message.getId());
        } else {
            // 发送失败
            MessageKit.fail(message.getId());
        }
    }

    private Map<String, String> getConfigMap(List<ChannelInfo.Config> configs){
        Map<String,String> configMap = new HashMap<>();
        configs.forEach(config -> {
            configMap.put(config.getName(), config.getDefaultValue());
        });
        return configMap;
    }
}
