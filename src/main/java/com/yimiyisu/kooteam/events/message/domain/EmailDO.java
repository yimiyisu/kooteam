package com.yimiyisu.kooteam.events.message.domain;

import lombok.Data;

import java.util.List;

@Data
public class EmailDO {
    private String id;
    private String uid;
    private String title;
    private String content;
    private List<String> recievers;
    private List<String> groups;
    private String timer;
    private String summary;
}
