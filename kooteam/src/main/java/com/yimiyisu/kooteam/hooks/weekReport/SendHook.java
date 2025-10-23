package com.yimiyisu.kooteam.hooks.weekReport;

import com.yimiyisu.kooteam.events.util.Email;
import com.yimiyisu.kooteam.service.EmailService;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenMessage;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.domain.MessageDO;
import com.zen.interfaces.IHook;
import com.zen.kit.EventKit;
import com.zen.kit.MessageKit;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@ZenHook("patch/weekSend")
public class SendHook implements IHook {


    @Inject
    private ZenEngine zenEngine;

    @Override
    public void after(ZenData data, ZenResult result) {
        ZenResult reportData = zenEngine.execute("get/weekByOwner", data);
        if (reportData.isEmpty()) return;

        Set<String> receivers = Optional.ofNullable(reportData.getAsStringList("recievers"))
                .map(HashSet::new)
                .orElse(new HashSet<>());
        List<String> groupIds = reportData.getAsStringList("groups");
        List<String> email = EmailService.getUidByGroupIds(receivers, groupIds, data.getId(), data.getUid());
        ZenMessage zenMessage = new ZenMessage(EmailService.TEMPLATENAME);
        zenMessage.setTitle(reportData.get("title"));
        zenMessage.setFrom(reportData.get("uid"));
        zenMessage.setContent(Email.getTemplate(reportData.get("uid"), reportData.get("content")));

        String messageId = zenMessage.send(email);
        MessageDO messageDO = MessageKit.get(messageId);
        EventKit.trigger(messageDO);
    }

}
