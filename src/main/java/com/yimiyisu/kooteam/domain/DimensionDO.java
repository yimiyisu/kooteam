package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.List;

@Data
public class DimensionDO {
    private String id;
    private String evaluationId;
    private int type;
    private int weight;
    private List<QuestionDO> questions;
    private double score;
    private int num;
}
