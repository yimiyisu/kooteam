package com.zeto.kooteam.service.eventbus.model;

import lombok.Data;

@Data
public class MessageModel {
    private String from;
    private String to;
    private String content;
    private String objectId;
    private MessageType messageType;
    private String unionId;

    public MessageModel(String from, String to, String content, String objectId, MessageType type) {
        this.from = from;
        this.to = to;
        this.content = content;
        this.objectId = objectId;
        this.messageType = type;
    }

    public MessageModel(String from, String content, String objectId, MessageType type, String unionId) {
        this.from = from;
        this.unionId = unionId;
        this.content = content;
        this.objectId = objectId;
        this.messageType = type;
    }
}
