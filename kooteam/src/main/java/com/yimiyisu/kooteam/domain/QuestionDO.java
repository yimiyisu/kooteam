package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.List;

@Data
public class QuestionDO {
    private String id;
    private String creator;
    private long createGmt;
    private long updateGmt;
    private String title;
    private int type;
    private List<Option> options;
    private int require;
    private String evaluationId;
    private long order;
    private int score;

    @Data
    public static class Option {
        private String id;
        private String label;
        private int score;
    }
}
