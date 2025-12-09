package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.google.gson.JsonObject;
import com.yimiyisu.kooteam.domain.PlanDO;
import com.yimiyisu.kooteam.events.message.channels.CommonMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.yimiyisu.kooteam.events.model.SendPlanNotEventModel;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.domain.MessageDO;
import com.zen.interfaces.IEvent;
import com.zen.kit.JsonKit;
import com.zen.kit.UserKit;

import java.util.*;
import java.util.stream.Collectors;

public class SendPlanNotEvent implements IEvent<SendPlanNotEventModel> {

    @Inject
    private ZenEngine zenEngine;

    @Override
    @Subscribe
    public void execute(SendPlanNotEventModel sendPlanNotEventModel) {
        PlanDO plan = sendPlanNotEventModel.getPlan();
        if (plan == null) return;
        // 获取接收人列表
        List<List<String>> specify = plan.getSpecify();
        List<String> secondElements = specify.stream()
                .map(subList -> {
                    if (subList.size() == 1) return subList.get(0);
                    else return subList.get(1);
                })
                .toList();
        String white = plan.getWhite();
        Set<String> receivers = getReceivers(secondElements, white);

        // 给每个人创建规划并发送待办通知
        for (String receiver : receivers) {
            ZenData putData = ZenData.create().put("uid", receiver).put("planId", plan.getId())
                    .put("title", plan.getTitle()).put("description", plan.getDescription())
                    .put("startGmt", plan.getStartGmt()).put("endGmt", plan.getEndGmt())
                    .put("cycle", plan.getCycle()).put("charge", plan.getCharge());
            zenEngine.execute("put/plan_user", putData);
        }

        // 发送通知
        MessageDO message = new MessageDO();
        message.setTitle("规划任务");
        message.setFrom(plan.getCharge());
        message.setTo(receivers.stream().toList());
        String content = UserKit.get(plan.getCreator()).getNick() + "给你创建了一个规划任务：" + plan.getTitle() + "，请及时填写。";
        Map<String, String> contentMap = new HashMap<>();
        contentMap.put("content", content);
        message.setContent(JsonKit.stringify(contentMap));
        ChannelInfo channelInfo = new ChannelInfo();
        channelInfo.setMessageType("text");
        Map<String, String> config = new HashMap<>();
        channelInfo.setConfig(config);
        CommonMessage commonMessage = new CommonMessage();
        commonMessage.send(message, channelInfo);
    }

    // 获取接收者集合
    private Set<String> getReceivers(List<String> departments, String white) {
        // 查询部门下所有员工
        Set<String> userList = new HashSet<>();
        ZenResult empsResult = zenEngine.execute("list/department_user_in", ZenData.create().put("departmentIds", departments));
        if (empsResult.isEmpty()) return  userList;
        List<JsonObject> uidListJson = empsResult.asList(JsonObject.class);
        List<String> uidList = uidListJson.stream()
                .map(obj -> obj.get("employeeId").getAsString())
                .toList();
        userList.addAll(uidList);

        // 查询白名单
        ZenResult whiteIdsResult = zenEngine.execute("list/white_emp", ZenData.create().put("whiteId", white));
        if (whiteIdsResult.isEmpty()) return userList;
        List<Map> whiteIdList = whiteIdsResult.asList(Map.class);

        // 过滤白名单
        Set<String> empIdsToRemove = whiteIdList.stream()
                .map(map -> (String) map.get("empId"))
                .collect(Collectors.toSet());

        Set<String> filteredList = userList.stream()
                .filter(item -> !empIdsToRemove.contains(item))
                .collect(Collectors.toSet());

        return filteredList;
    }
}
