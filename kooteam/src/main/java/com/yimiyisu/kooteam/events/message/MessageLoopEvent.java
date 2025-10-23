package com.yimiyisu.kooteam.events.message;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.events.message.domain.MessageLoopModel;
import com.zen.annotation.Crontab;
import com.zen.domain.MessageDO;
import com.zen.interfaces.IEvent;
import com.zen.kit.EventKit;
import com.zen.kit.MessageKit;

import java.util.List;

// 每隔30秒轮训一次消息任务
@Crontab("0/30 * * * * ? *")
public class MessageLoopEvent implements IEvent<MessageLoopModel> {


    @Subscribe
    @Override
    public void execute(MessageLoopModel event) {
        List<MessageDO> messageDOList = MessageKit.queue();
        if (messageDOList.isEmpty()) return;
        for (MessageDO messageDO : messageDOList) EventKit.trigger(messageDO);
    }
}
