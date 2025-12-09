package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.List;

@Data
public class PlanDO {
    private String id;
    private String creator;
    private List<List<String>> specify;
    private String white;
    private String title;
    private long startGmt;
    private long endGmt;
    private int cycle;
    private int status;
    private int isSend;
    private String charge;
    private String description;
}
