package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.List;

@Data
public class GoalDO {
    private String id;
    private String title;
    private String description;
    private int type;
    private String parentId;
    private String owner;
    private int cycle;
    private double process;
    private double weight;
    private int status;
    private String planId;
    private List<String> watchers;
    private List<String> aligns;
    private int range;
    private List<GoalDO> krs;
    private List<Progress> progress;
    private List<String> things;

    @Data
    public static class Progress {
        private String id;
        private String creator;
        private double process;
        private int preProcess;
        private String content;
        private long createGmt;
    }

    @Data
    public static class Score{
        private double score;
        private String desc;
    }
}
