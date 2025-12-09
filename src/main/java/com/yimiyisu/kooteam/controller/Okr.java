package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.domain.GoalDO;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.enums.ZenRole;
import com.zen.kit.DateKit;
import com.zen.kit.StringKit;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AccessRole(ZenRole.SIGNATURE)
public class Okr extends ZenController {

    @Inject
    private ZenEngine zenEngine;

    // 修改目标进度
    public ZenResult patchProcess(ZenData data) {
        String content = data.get("content");
        String goalId = data.get("id");

        // 查询目标详情
        ZenResult goalResult = zenEngine.execute("get/goal", ZenData.create().put("id", goalId));
        if (goalResult.isEmpty()) return ZenResult.fail("目标不存在");
        GoalDO goal = goalResult.asEntity(GoalDO.class);

        // 创建进展数据
        GoalDO.Progress progress = new GoalDO.Progress();
        progress.setContent(content);
        progress.setId(StringKit.shortId());
        progress.setCreator(data.getUid());
        progress.setCreateGmt(DateKit.now());
        progress.setProcess(goal.getProcess());
        progress.setProcess(Double.parseDouble(data.get("process")));
        List<GoalDO.Progress> preProgress = goal.getProgress();
        if (preProgress == null || preProgress.isEmpty()) preProgress = new ArrayList<>();
        preProgress.add(progress);
        data.put("progress", preProgress);


        // 更新
        zenEngine.execute("patch/goal", data);
        return ZenResult.success("操作成功");
    }

    // 编辑进展内容
    public ZenResult editProgress(ZenData data) {
        GoalDO.Progress progress = data.get("item", GoalDO.Progress.class);
        String goalId = data.get("goalId");
        if (StringKit.isEmpty(goalId) || progress == null) return ZenResult.fail("进展或目标不存在");

        // 获取进展列表
        List<GoalDO.Progress> preProgresses = getProgress(goalId);
        if (preProgresses == null || preProgresses.isEmpty()) return ZenResult.fail("进展或目标不存在");

        for (int i = 0; i < preProgresses.size(); i++) {
            if (preProgresses.get(i).getId().equals(progress.getId())) {
                preProgresses.get(i).setContent(data.get("content"));
                break;
            }
        }

        zenEngine.execute("patch/goal", ZenData.create().put("id", goalId).put("progress", preProgresses));

        return ZenResult.success("操作成功");
    }

    // 创建关联任务
    public ZenResult addThing(ZenData data) {
        // 查询kr详情
        String krId = data.get("krId");
        ZenResult krResult = zenEngine.execute("get/goal", ZenData.create().put("id", krId));
        if (krResult.isEmpty()) return ZenResult.fail("KR不存在");
        GoalDO kr = krResult.asEntity(GoalDO.class);

        // 插入待办数据
        ZenResult addResult = zenEngine.execute("put/thing_kr", data);

        // 更新KR
        List<String> things = kr.getThings();
        if (things == null) things = new ArrayList<>();
        things.add(addResult.get("id"));
        zenEngine.execute("patch/goal", ZenData.create().put("id", krId).put("things", things));
        return ZenResult.success("操作成功");
    }

    // 添加关注人/参与人
    public ZenResult addUsers(ZenData data) {
        String id = data.get("id");
        if (StringKit.isEmpty(id)) return ZenResult.fail("目标不存在");
        List<String> participantUsers = data.getAsList("participant", String.class);
        List<String> watcherUsers = data.getAsList("watchers", String.class);

        if (participantUsers != null && !participantUsers.isEmpty()) {
            zenEngine.execute("patch/goal", ZenData.create().put("id", id).put("participant", participantUsers));
        } else if (watcherUsers != null && !watcherUsers.isEmpty()) {
            zenEngine.execute("patch/goal", ZenData.create().put("id", id).put("watchers", watcherUsers));
        }

        return ZenResult.success("操作成功");
    }

    // 编辑评分
    public ZenResult editScore(ZenData data) {
        String id = data.get("goalId");
        if (StringKit.isEmpty(id)) return ZenResult.fail("进展或目标不存在");
        String type = data.get("type");
        int score = Integer.parseInt(data.get("score"));
        String desc = data.get("desc");

        Map<String, Object> scoreMap = new HashMap<>();
        scoreMap.put("score", score);
        scoreMap.put("desc", desc);

        if (StringKit.equals("super", type)) {
            scoreMap.put("uid", data.getUid());
            zenEngine.execute("patch/goal", ZenData.create().put("id", id).put("scoreSuper", scoreMap));
        } else if (StringKit.equals("self", type)) {
            zenEngine.execute("patch/goal", ZenData.create().put("id", id).put("scoreSelf", scoreMap));
        }

        return ZenResult.success("操作成功");
    }

    // 查询o以及krs
    public ZenResult okrs(ZenData data) {
        GoalDO o = data.parse(GoalDO.class);
        if (o == null) return ZenResult.fail("目标不存在");

        ZenResult krsResult = zenEngine.execute("list/goal_kr", ZenData.create().put("parentId", o.getId()));
        if (krsResult.isEmpty()) {
            o.setKrs(new ArrayList<>());
            return ZenResult.success().setData(o);
        }
        List<GoalDO> krsResultList = krsResult.asList(GoalDO.class);
        o.setKrs(krsResultList);

        return ZenResult.success().setData(o);
    }

    private List<GoalDO.Progress> getProgress(String goalId) {
        ZenResult goalResult = zenEngine.execute("get/goal", ZenData.create().put("id", goalId));
        if (goalResult.isEmpty()) return null;
        GoalDO goal = goalResult.asEntity(GoalDO.class);
        List<GoalDO.Progress> progress = new ArrayList<>();
        progress = goal.getProgress();
        return progress;
    }
}
