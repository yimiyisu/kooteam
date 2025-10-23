package com.yimiyisu.kooteam.events.message.channels.domain;

import lombok.Data;

@Data
public class WeworkTextMessageDO {
    //指定接收消息的成员(成员ID),多个接收者用‘|’分隔，@all全部成员发送,最多支持1000
    private String touser;
    //指定接收消息的部门(部门ID)，多个接收者用‘|’分隔，@all全部部门发送，最多支持100
    private String toparty;
    //指定接收消息的标签，多个接收者用‘|’分隔，@all全部部门发送，最多支持100
    private String totag;
    //企业微信消息类型 msgtype
    private String msgtype;
    //消息内容，最长不超过2048个字节 text参数的content字段可以支持换行、以及A标签，即可打开自定义的网页（可参考以上示例代码）(注意：换行符请用转义过的\n)
    private TextContent text;

    @Data
    public static class TextContent {
        private String content;
    }
}
