package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.List;

@Data
public class WeekReportDO {
    private String id;
    private String creator;
    private String title;
    private List<String> recievers;
    private List<String> groups;
    private String uid;
    private String content;
    private int status;
    private long timer;
    private String summary;
    private int type;
    private String group;
    private List<String> recivers;
    private int isSend;
    private String reason;
    private long startGmt;
    private long endGmt;
}
