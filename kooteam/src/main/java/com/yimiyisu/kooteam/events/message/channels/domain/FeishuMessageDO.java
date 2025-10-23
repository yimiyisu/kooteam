package com.yimiyisu.kooteam.events.message.channels.domain;

import com.yimiyisu.kooteam.events.message.channels.domain.messageenum.FeishuMsgType;
import com.zen.kit.StringKit;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class FeishuMessageDO {
    //接收者ID类型
    private String receiveIdType;
    //消息接收者的 ID
    private String receiveId;
    //消息类型。
    private FeishuMsgType msgType;
    //消息内容
    private Object content;
    //自定义设置的唯一字符串序列，用于在发送消息时请求去重。持有相同 uuid 的请求，在 1 小时内至多成功发送一条消息。
    //每次都不同
    private String uuid;

    public String getUUID(){
        this.uuid = StringKit.rand(50);
        return uuid;
    }

    @Data
    @Builder
    public static class TextContent {
        /**
         * 消息文本内容
         * 必填，长度限制：post类型 ≤ 10K；text/卡片消息 ≤ 15000字符
         */
        private String text;
    }

    /* 快捷构建方法 */
    public static FeishuMessageDO buildTextMessage(
            String receiveId,
            String textContent,
            String uuid) {
        return FeishuMessageDO.builder()
                .receiveId(receiveId)
                .msgType(FeishuMsgType.TEXT)
                .content(TextContent.builder()
                        .text(textContent)
                        .build())
                .uuid(uuid)
                .build();
    }


}
