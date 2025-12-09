package com.yimiyisu.kooteam.events.message.channels.domain.messageenum;

import com.fasterxml.jackson.annotation.JsonValue;

public enum FeishuMsgReceiveIdType {
    //标识一个用户在某个应用中的身份
    OPENID("open_id"),
    //标识一个用户在某个应用开发商下的身份。
    UNIONID("union_id"),
    //标识一个用户在某个租户内的身份。
    USERID("user_id"),
    //以用户的真实邮箱来标识用户。
    EMAIL("email"),
    //以群 ID 来标识群聊。
    CHATID("chat_id");

    private final String value;

    FeishuMsgReceiveIdType(String value) {
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
