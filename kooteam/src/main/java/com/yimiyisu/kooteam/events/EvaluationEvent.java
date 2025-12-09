package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.events.model.EvaluationEventModel;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.interfaces.IEvent;
import com.zen.kit.StringKit;

import java.util.List;
import java.util.Map;

public class EvaluationEvent implements IEvent<EvaluationEventModel> {

    @Inject
    private ZenEngine zenEngine;

    @Override
    @Subscribe
    public void execute(EvaluationEventModel evaluationEventModel) {
        String evaluationId = evaluationEventModel.getEvaluationId();
        if (StringKit.isEmpty(evaluationId)) return;
        ZenResult questionResult = zenEngine.execute("list/question_score", ZenData.create().put("evaluationId", evaluationId));
        if (questionResult.isEmpty()) return;

        List<Map<String, Object>> listMap = questionResult.asListMap();
        double sum = 0;
        for (Map<String, Object> map : listMap) {
            double score = Double.parseDouble(map.get("score").toString());
            sum += score;
        }

        zenEngine.execute("patch/evaluation", ZenData.create().put("id", evaluationId).put("score", sum));
    }
}
