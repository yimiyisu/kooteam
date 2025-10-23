package com.yimiyisu.kooteam.events.message;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.events.message.domain.EmailDO;
import com.yimiyisu.kooteam.events.util.Email;
import com.yimiyisu.kooteam.service.EmailService;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenMessage;
import com.zen.ZenResult;
import com.zen.annotation.Crontab;
import com.zen.annotation.Inject;
import com.zen.domain.MessageDO;
import com.zen.interfaces.IEvent;
import com.zen.kit.ConfigKit;
import com.zen.kit.DateKit;
import com.zen.kit.EventKit;
import com.zen.kit.MessageKit;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

// 每隔5分钟轮训一次消息任务
@Crontab("* 0/5 * * * ? *")
public class EmailLoopEvent implements IEvent<EmailLoopEvent> {
    @Inject
    private ZenEngine zenEngine;

    @Subscribe
    @Override
    public void execute(EmailLoopEvent emailLoopEvent) {
        if (!ConfigKit.isDev()) return;
        String maxTime = String.valueOf(DateKit.now() + 600);
        String minTime = String.valueOf(DateKit.now() - 600);
        ZenResult zenResult = zenEngine.execute("list/week", ZenData.create("pageSize", "200").put("maxTime", maxTime).put("minTime", minTime));
        if (zenResult.isEmpty()) return;
        for (EmailDO emailDO : zenResult.asList(EmailDO.class)) {
            Set<String> receivers = Optional.ofNullable(emailDO.getRecievers())
                    .map(HashSet::new)
                    .orElse(new HashSet<>());
            List<String> groupIds = emailDO.getGroups();

            ZenMessage zenMessage = new ZenMessage(EmailService.TEMPLATENAME);
            zenMessage.setTitle(emailDO.getTitle());
            zenMessage.setFrom(emailDO.getUid());
            zenMessage.setContent(Email.getTemplate(emailDO.getUid(), emailDO.getContent()));

            List<String> email = EmailService.getUidByGroupIds(receivers, groupIds, emailDO.getId(), emailDO.getUid());
            zenEngine.execute("patch/weekSendById", ZenData.create("id", emailDO.getId()).put("status", 1));
            if (email.isEmpty()) continue;
            String messageId = zenMessage.send(email);
            MessageDO messageDO = MessageKit.get(messageId);
            EventKit.trigger(messageDO);
        }
    }
}
