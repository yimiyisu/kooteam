package com.yimiyisu.kooteam.service;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.yimiyisu.kooteam.events.util.Email;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenMessage;
import com.zen.ZenResult;
import com.zen.annotation.Component;
import com.zen.annotation.Inject;
import com.zen.domain.ZenUser;
import com.zen.kit.StringKit;
import com.zen.kit.UserKit;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Component
public class EmailService {
    public static final String TEMPLATENAME = "mail";
    @Inject
    private static ZenEngine zenEngine;

    public void sendWeekReport(String weekId, String uid) {
        ZenResult reportData = zenEngine.execute("get/weekByOwner", ZenData.create().put("id", weekId));
        if (reportData.isEmpty()) return;

        // 获取接收人邮件集合
        List<String> receiverList = reportData.getAsStringList("recievers") == null ? new ArrayList<>() : reportData.getAsStringList("recievers");
        Set<String> receivers = new HashSet<>(receiverList);
        List<String> groupIds = reportData.getAsStringList("groups");
        List<String> email = EmailService.getUidByGroupIds(receivers, groupIds, weekId, uid);

        // 创建消息，等待轮训触发
        ZenMessage zenMessage = new ZenMessage(EmailService.TEMPLATENAME);
        zenMessage.setTitle(reportData.get("title"));
        zenMessage.setFrom(reportData.get("uid"));
        zenMessage.setContent(Email.getTemplate(reportData.get("uid"), reportData.get("content")));
        if (email.isEmpty()) return;
        zenMessage.send(email);

        // 更新周报发送状态
        zenEngine.execute("patch/week", ZenData.create().put("id", weekId).put("status", 3));
    }

    public static List<String> getUidByGroupIds(Set<String> receivers, List<String> groupIds,String weekId,String uid) {
        if (groupIds != null && !groupIds.isEmpty()) {
            List<JsonObject> groups = zenEngine.selectByIds("week_group", groupIds);
            if (groups != null) {
                for (JsonObject group : groups) {
                    JsonArray content = group.get("content").getAsJsonArray();
                    if (content == null) {
                        continue;
                    }
                    for (JsonElement s : content) {
                        receivers.add(s.getAsString());
                    }
                }
            }
        }
        List<String> receiverList = new ArrayList<>(receivers);
        List<String> email = new ArrayList<>();

        ZenData data = ZenData.create();
        List<ZenUser> users = UserKit.selectByUids(receiverList);
        for (ZenUser user : users) {
            if (StringKit.isNotEmpty(user.getEmail())) {
                email.add(user.getEmail());
                data.put("weekId", weekId);
                data.put("uid", user.getId()).refresh();
                data.put("sendUid", uid);
                zenEngine.execute("put/week_recieve", data);
            }
        }
        return email;
    }
}
