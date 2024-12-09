package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.events.model.MessageEventModel;
import com.zen.interfaces.IEvent;

public class MessageEvent implements IEvent<MessageEventModel> {


    @Subscribe
    @Override
    public void execute(MessageEventModel event) {
    }
}
