package com.zeto.kooteam.service.eventbus.model;

import com.zeto.domain.ZenSite;
import lombok.Data;

@Data
public class MessageModel {
    private String from;
    private String to;
    private String content;
    /**
     * 链接域名
     */
    private String origin;
    private String objectId;
    private MessageType messageType;
    private String unionId;
    private ZenSite site;

    public MessageModel() {
    }

    public MessageModel(String from, String to, String content, String objectId, MessageType type) {
        this.from = from;
        this.to = to;
        this.content = content;
        this.objectId = objectId;
        this.messageType = type;
    }

}
