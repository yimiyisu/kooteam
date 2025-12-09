package com.yimiyisu.kooteam.domain;

import lombok.Data;

import java.util.List;

@Data
public class ThingDO {
    private long createTime;
    private String id;
    private String title;
    private String content;
    private String owner;
    private List<String> watchers;
    private long start;
    private long end;
    private int status;
    private String createUid;
    private List<String> file;
    private int type;
    private int quadrant;
}
