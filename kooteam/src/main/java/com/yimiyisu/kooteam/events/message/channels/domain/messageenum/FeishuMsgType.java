package com.yimiyisu.kooteam.events.message.channels.domain.messageenum;

import com.fasterxml.jackson.annotation.JsonValue;

//飞书消息类型枚举
public enum FeishuMsgType {
    TEXT("text"),
    POST("post"),
    IMAGE("image"),
    AUDIO("audio"),
    FILE("file"),
    MEDIA("media"),
    STICKER("sticker"),
    INTERACTIVE("interactive"),
    SHARE_CHAT("share_chat"),
    SHARE_USER("share_user"),
    SYSTEM("system");

    private final String value;

    FeishuMsgType(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }

    @Override
    public String toString() {
        return this.value; // 直接返回 value 字段的值
    }
}
