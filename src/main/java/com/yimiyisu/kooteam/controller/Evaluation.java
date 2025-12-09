package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.domain.QuestionDO;
import com.yimiyisu.kooteam.events.model.EvaluationEventModel;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.enums.ZenRole;
import com.zen.kit.EventKit;
import com.zen.kit.StringKit;

import java.util.List;

@AccessRole(ZenRole.SIGNATURE)
public class Evaluation extends ZenController {

    @Inject
    private ZenEngine zenEngine;

    // 插入问题
    public ZenResult putQuestion(ZenData data) {
        action(data, "put/question");
        return ZenResult.success("操作成功");
    }

    // 更新问题
    public ZenResult patchQuestion(ZenData data) {
        action(data, "patch/question");
        return ZenResult.success("操作成功");
    }

    // 删除问题
    public ZenResult deleteQuestion(ZenData data) {
        ZenResult deleteResult = zenEngine.execute("delete/question", data);

        EvaluationEventModel evaluationEventModel = new EvaluationEventModel();
        String evaluationId = deleteResult.get("evaluationId");
        evaluationEventModel.setEvaluationId(evaluationId);
        EventKit.trigger(evaluationEventModel);
        return ZenResult.success("操作成功");
    }

    // 删除维度关联问题
    public ZenResult delRelationship(ZenData data) {
        String questionId = data.get("questionId");
        String dimensionId = data.get("dimensionId");
        List<String> questions = data.getAsList("questions", String.class);
        if (!StringKit.isNotEmpty(questionId, dimensionId)) return ZenResult.fail("题目或维度不存在");

        questions.remove(questionId);
        zenEngine.execute("patch/dimension", ZenData.create().put("id", dimensionId).put("questions", questions).put("num", questions.size()));

        return ZenResult.success("操作成功");
    }

    // 插入维度数据
    public ZenResult putDimension(ZenData data) {
        List<QuestionDO> questions = data.getAsList("questions", QuestionDO.class);
        double score = 0;
        int num = 0;
        if (questions != null && !questions.isEmpty()) {
            for (QuestionDO question : questions) {
                if (question.getType() == 5) continue;
                score += question.getScore();
            }
            num = questions.size();
        }

        Integer weight = data.get("weight", Integer.class);
        if (weight != null && weight > 0) {
            score = score * weight / 100;
        }
        data.put("score", score);
        data.put("num", num);
        zenEngine.execute("put/dimension", data);
        return ZenResult.success("操作成功");
    }

    private void action(ZenData data, String path) {
        int type = Integer.parseInt(data.get("type"));
        if (type != 5) {
            // 更新问题分数
            int sum = 0;
            List<QuestionDO.Option> options = data.getAsList("options", QuestionDO.Option.class);
            if (type == 3) { // 多选 - 计算总分数
                sum = sumScore(options);
            } else if (type == 1) { // 单选 - 取最大值
                sum = options.stream()
                        .mapToInt(QuestionDO.Option::getScore)
                        .max()
                        .orElse(0);
            }
            data.put("score", sum);
            zenEngine.execute(path, data);
            // 异步更新评估
            EvaluationEventModel evaluationEventModel = new EvaluationEventModel();
            evaluationEventModel.setEvaluationId(data.get("evaluationId"));
            EventKit.trigger(evaluationEventModel);
            return;
        }
        zenEngine.execute(path, data);
    }

    // 计算分数和
    private int sumScore(List<QuestionDO.Option> options) {
        int sum = 0;
        for (QuestionDO.Option option : options) {
            if (option == null) continue;
            sum += option.getScore();
        }
        return sum;
    }
}
