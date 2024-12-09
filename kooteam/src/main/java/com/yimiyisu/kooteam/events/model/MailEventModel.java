package com.yimiyisu.kooteam.events.model;

import lombok.Data;

import java.util.List;

@Data
public class MailEventModel {
    private String title;
    private String content;
    private List<String> to;
    protected String from;
}
