package com.yimiyisu.kooteam.events.model;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ThingEmailEventModel {
    private String thingId; // 待办id
    private String from; // 发送人
    private int type; // 操作类型
    private String original; // 原始数据
}
