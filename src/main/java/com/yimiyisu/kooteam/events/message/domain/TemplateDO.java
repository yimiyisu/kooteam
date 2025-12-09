package com.yimiyisu.kooteam.events.message.domain;

import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class TemplateDO {
    List<Map<String,String>> channels;
}
