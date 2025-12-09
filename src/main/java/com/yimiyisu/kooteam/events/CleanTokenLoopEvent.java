package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.events.model.CleanTokenModel;
import com.zen.annotation.Crontab;
import com.zen.interfaces.IEvent;
import com.zen.kit.ConfigKit;
import com.zen.kit.UserKit;

// 每日凌晨3点执行，清理登陆超过七天的token
@Crontab("1 1 3 * * ? *")
public class CleanTokenLoopEvent implements IEvent<CleanTokenModel> {
    @Override
    @Subscribe
    public void execute(CleanTokenModel event) {
        if (ConfigKit.isDaily() || ConfigKit.isDev()) {
            return;
        }
        UserKit.cleanToken(7);
    }
}
