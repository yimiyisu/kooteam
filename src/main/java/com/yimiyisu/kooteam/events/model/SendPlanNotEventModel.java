package com.yimiyisu.kooteam.events.model;

import com.yimiyisu.kooteam.domain.PlanDO;
import lombok.Data;

@Data
public class SendPlanNotEventModel {
    private PlanDO plan;
}
