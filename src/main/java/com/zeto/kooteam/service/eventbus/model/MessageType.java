package com.zeto.kooteam.service.eventbus.model;

public enum MessageType {
    THING(1),
    PROJECT(2),//项目相关消息
    COMMENT(10);

    private final int value;

    public int getValue() {
        return value;
    }

    MessageType(int value) {
        this.value = value;
    }
}
