package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.Date;

@Data
public class LogDO {
    private String level;
    private String log;
    private String location;
    private String thread;
    private Date time;
    private String message;
    private String formatTime;
    private String context;
}
