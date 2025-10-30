package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.zen.domain.MessageDO;
import com.zen.kit.ConfigKit;
import com.zen.kit.StringKit;

import java.util.HashMap;
import java.util.Map;

public class CommonMessage {
    private IMessage platformMessage;
    private IMessage mailMessage;

    public CommonMessage() {
        String loginMode = ConfigKit.get("loginMode");
        // 平台消息
        if (!StringKit.isEmpty(loginMode)) {
            switch (loginMode) {
                case "weword": // 企业微信
                    platformMessage = WeworkMessage.getInstance();
                    break;
                case "dingding": // 钉钉
                    platformMessage = DingdingMessage.getInstance();
                    break;
                case "feishu": // 飞书
                    platformMessage = FeishuMessage.getInstance();
                    break;
            }
        }

        // 邮件消息
        boolean email = StringKit.isNotEmpty(ConfigKit.get("mailHost"), ConfigKit.get("mailPort"), ConfigKit.get("mailUser"), ConfigKit.get("mailPassword"));
        if (email) mailMessage = EmailMessage.getInstance();
    }

    public void send(MessageDO messageDO) {
        if (platformMessage != null) { // 发送平台消息
            // 创建渠道信息
            ChannelInfo channelInfo = new ChannelInfo();
            Map<String, String> config = new HashMap<>();
            channelInfo.setConfig(config);
            if (platformMessage instanceof WeworkMessage) {
                channelInfo.setMessageType("textcard");
            }
            platformMessage.send(messageDO, channelInfo);
        }
        if (mailMessage != null) { // 发送邮件
            mailMessage.send(messageDO, null);
        }
    }
}
