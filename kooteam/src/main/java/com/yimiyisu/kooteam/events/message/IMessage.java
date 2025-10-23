package com.yimiyisu.kooteam.events.message;

import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.zen.domain.MessageDO;

public interface IMessage {
    //发送消息
    boolean send(MessageDO messageDO, ChannelInfo channelInfo);
}
