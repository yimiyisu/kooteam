package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.zen.domain.MessageDO;

public class WechatMessage implements IMessage {
    private static IMessage instance = null;

    public static IMessage getInstance() {
        if (WechatMessage.instance == null) WechatMessage.instance = new WechatMessage();
        return WechatMessage.instance;
    }

    private WechatMessage() {

    }

    @Override
    public boolean send(MessageDO messageDO, ChannelInfo channelInfo) {
        return true;
    }
}
