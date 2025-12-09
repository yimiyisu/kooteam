package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.domain.DeepSeekResponse;
import com.yimiyisu.kooteam.domain.ThingDO;
import com.yimiyisu.kooteam.domain.WeekReportDO;
import com.yimiyisu.kooteam.domain.enums.ThingQuadrant;
import com.yimiyisu.kooteam.domain.enums.ThingStatus;
import com.yimiyisu.kooteam.events.model.AIWeekReportEventModel;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.interfaces.IEvent;
import com.zen.kit.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class AIWeekReportEvent implements IEvent<AIWeekReportEventModel> {

    @Inject
    private ZenEngine zenEngine;
    private static final String DEEPSEEK_API_KEY = "deepseekApikey";

    @Override
    @Subscribe
    public void execute(AIWeekReportEventModel aiWeekReportEventModel) {
        String aiWeekId = aiWeekReportEventModel.getWeekId();
        // 1. 查询AI周报详情
        ZenResult aiWeekResult = zenEngine.execute("get/ai_week", ZenData.create().put("id", aiWeekId));
        if (aiWeekResult.isEmpty()) return;
        WeekReportDO weekReport = aiWeekResult.asEntity(WeekReportDO.class);

        // 2. 获取待办列表
        int type = weekReport.getType(); // 类型：个人/团队
        String targetId = type == 1 ? weekReport.getCreator() : weekReport.getGroup();
        if (StringKit.isEmpty(targetId)) {
            fail(aiWeekId, "没有目标人或组别");
        }
        long startGmt = weekReport.getStartGmt(); // 查询开始时间
        long endGmt = weekReport.getEndGmt(); // 查询结束时间
        List<ThingDO> thingList = getThingList(type, targetId, startGmt, endGmt);
        if (thingList == null || thingList.isEmpty()) {
            fail(aiWeekId, "暂无待办事项");
            return;
        }

        // 3. 构建提示词
        String typeStr = type == 1 ? "个人" : "团队";
        String prompt = buildPrompt(thingList, null, typeStr);

        // 4. 调用deepseek获取周报
        // 获取apikey
        Map<String, Object> apikeyMap = JsonKit.parseAsMap(ConfigKit.self(DEEPSEEK_API_KEY));
        if (apikeyMap == null || !apikeyMap.containsKey(DEEPSEEK_API_KEY) || StringKit.isEmpty(apikeyMap.get(DEEPSEEK_API_KEY))) {
            fail(aiWeekId, "未设置apiKey");
            return;
        }
        String apikey = (String) apikeyMap.get(DEEPSEEK_API_KEY);
        // 发送请求
        String resStr = askDeepseek(apikey, prompt);
        boolean success = isSuccess(resStr); // 判断是否生成成功
        if (!success) { // 未生成成功
            if (StringKit.isEmpty(resStr)) resStr = "请求异常";
            fail(aiWeekId, resStr);
            return;
        }
        // 获取生成结果
        DeepSeekResponse response = JsonKit.parse(resStr, DeepSeekResponse.class);
        DeepSeekResponse.Message message = response.getChoices().get(0).getMessage();
        String content = message.getContent();
        // 更新状态和内容
        zenEngine.execute("patch/ai_week", ZenData.create().put("id", aiWeekId).put("status", 3).put("content", content));
    }

    /**
     * 获取待办列表
     * @param type 类型：个人/团队
     * @param targetId 目标：uid/groupId
     * @param startGmt 开始时间
     * @param endGmt 结束时间
     * @return List<ThingDO>
     */
    private List<ThingDO> getThingList(int type, String targetId, long startGmt, long endGmt) {
        List<ThingDO> thingList = new ArrayList<>();
        if (type == 1) { // 个人
            return getThingWithOwner(thingList, targetId, startGmt, endGmt);
        } else { // 团队
            // 查询组成员
            ZenResult groupUidsResult = zenEngine.execute("get/week_group", ZenData.create().put("id", targetId));
            if (groupUidsResult.isEmpty()) return thingList;
            String content = groupUidsResult.get("content");
            if (StringKit.isEmpty(content)) return thingList;
            List<String> uids = JsonKit.parseAsStringList(content);

            // 查询组下所有成员的待办
            for (String uid : uids) {
                getThingWithOwner(thingList, uid, startGmt, endGmt);
            }
            return thingList;
        }
    }

    // 根据owner查询待办列表
    private List<ThingDO> getThingWithOwner(List<ThingDO> thingList, String ownerId, long startGmt, long endGmt) {
        // 未设置查询时间段，默认设置为一周内
        if (startGmt == 0 || endGmt == 0) {
            startGmt = DateKit.now() - 24 * 3600 * 7;
            endGmt = DateKit.now();
        }

        ZenResult personalResult = zenEngine.execute("list/thing_aireport", ZenData.create().put("owner", ownerId)
                .put("start", startGmt).put("end", endGmt));
        if (personalResult.isEmpty()) return thingList;
        thingList.addAll(personalResult.asList(ThingDO.class));
        return thingList;
    }

    /**
     * 构建提示词
     * @param thingList 待办列表
     * @param customInstructions 自定义提示
     * @param type 个人/团队
     * @return prompt
     */
    private String buildPrompt(List<ThingDO> thingList, String customInstructions, String type) {
        // 基本提示词
        StringBuilder prompt = new StringBuilder();
        if (StringKit.equals(type, "个人")) prompt.append("你现在是一个程序员，现在到了每周总结书写周报的时候，");
        else prompt.append("你是一个小团队的领导人，现在需要你根据每个人的待办事项书写本团队的周报，");
        prompt.append("请你根据待办列表书写一个").append(type).append("工作周报并最终以markdown格式返回。\n");
        prompt.append("不要出现不确定性的描述，如：'编写日期:2025-11-13(假设)'，需要生成的周报基本不需要用户二次修改可直接提交");
        if (StringKit.isNotEmpty(customInstructions)) prompt.append("关键字：").append(customInstructions).append("\n");
        prompt.append("待办事项列表如下：\n");

        // 待办事项提示词
        for (ThingDO thing : thingList) {
            prompt.append(String.format("标题：%s [状态:%s 优先级:%s] ", thing.getTitle(), ThingStatus.getLabelByValue(thing.getStatus()), ThingQuadrant.getLabelByValue(thing.getQuadrant())));
            prompt.append("任务计划：").append(DateKit.toString(thing.getStart(), "yyyy-MM-dd HH:mm:ss")).append(" - ").append(DateKit.toString(thing.getEnd(), "yyyy-MM-dd HH:mm:ss")).append("\n");
            prompt.append("内容：").append(thing.getContent()).append("\n");
            prompt.append("\n");
        }

        return prompt.toString();
    }

    // 调用deepseek
    private String askDeepseek(String apikey, String prompt) {
        String url = ConfigKit.get("dsBaseUrl") + ConfigKit.get("dsInterfaceUrl");
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        headers.put("Accept", "application/json");
        headers.put("Authorization", "Bearer " + apikey);

        Map<String, Object> body = new HashMap<>();
        List<Map<String, String>> messages = new ArrayList<>();
        Map<String, String> message = new HashMap<>();
        message.put("role", "user");
        message.put("content", prompt);
        messages.add(message);
        body.put("model", ConfigKit.get("dsModel"));
        body.put("messages", messages);
        body.put("stream", false);
        body.put("max_tokens", Integer.parseInt(ConfigKit.get("dsMaxTokens")));

        return HttpKit.postWidthHeader(url, body, headers);
    }

    // 判断是否生成成功
    private boolean isSuccess(String resStr) {
        if (StringKit.isEmpty(resStr)) return false;
        DeepSeekResponse response = JsonKit.parse(resStr, DeepSeekResponse.class);
        if (response.getChoices() == null || response.getChoices().isEmpty()) return false;
        DeepSeekResponse.Choice choice = response.getChoices().get(0);
        return choice.getMessage() != null && choice.getMessage().getContent() != null;
    }

    // 设置生成失败并记录原因
    private void fail(String aiWeekId, String reason) {
        zenEngine.execute("patch/ai_week", ZenData.create().put("id", aiWeekId).put("status", 5).put("reason", reason));
    }

}
