package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.zen.domain.MessageDO;
import com.zen.kit.ConfigKit;
import com.zen.kit.MessageKit;
import com.zen.kit.StringKit;

public class CommonMessage {
    private IMessage platformMessage;
    private IMessage mailMessage;

    public CommonMessage() {
        String loginMode = ConfigKit.get("loginMode");
        // 平台消息
        if (!StringKit.isEmpty(loginMode)) {
            switch (loginMode) {
                case "wework": // 企业微信
                    platformMessage = WeworkMessage.getInstance();
                    break;
                case "dingding": // 钉钉
                    platformMessage = DingdingMessage.getInstance();
                    if (ConfigKit.isOnline()) platformMessage = null;
                    break;
                case "feishu": // 飞书
                    platformMessage = FeishuMessage.getInstance();
                    break;
            }
        }

        // 邮件消息
        boolean email = StringKit.isNotEmpty(ConfigKit.get("mailHost"), ConfigKit.get("mailPort"),
                ConfigKit.get("mailUser"), ConfigKit.get("mailPassword"));
        if (email)
            mailMessage = EmailMessage.getInstance();
    }

    public void send(MessageDO messageDO, ChannelInfo channelInfo) {
        if (platformMessage != null) { // 发送平台消息
            boolean status = platformMessage.send(messageDO, channelInfo);
            // 消息发送完成，标记状态
            if (status) {
                MessageKit.finish(messageDO.getId());
            } else {
                // 发送失败
                MessageKit.fail(messageDO.getId());
            }
        }
        if (mailMessage != null) { // 发送邮件
            boolean status = mailMessage.send(messageDO, channelInfo);
            // 消息发送完成，标记状态
            if (status) {
                MessageKit.finish(messageDO.getId());
            } else {
                // 发送失败
                MessageKit.fail(messageDO.getId());
            }
        }
    }
}
