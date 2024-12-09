package com.yimiyisu.kooteam.events.model;

import lombok.Data;

@Data
public class MessageEventModel {
    private String title;
    private String content;
    private String from;
    private String to;
}
