package com.yimiyisu.kooteam.events.message.domain;

import lombok.Data;

@Data
public class MessageResultDO {
    //消息返回码
    private String errcode;
    //对返回码的文本描述内容
    private String errmsg;
    //企业微信消息返回参数
    //消息id
    private String msgid;
    //仅消息类型为“按钮交互型”，“投票选择型”和“多项选择型”的模板卡片消息返回，应用可使用response_code调用更新模版卡片消息接口，72小时内有效，且只能使用一次
    private String response_code;

    //钉钉消息返回参数
    //请求ID。
    private String request_id;
    //创建的异步发送任务ID。
    private String task_id;
}
