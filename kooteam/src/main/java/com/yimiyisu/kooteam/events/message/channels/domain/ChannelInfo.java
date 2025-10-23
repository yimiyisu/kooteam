package com.yimiyisu.kooteam.events.message.channels.domain;

import lombok.Data;

import java.util.Map;

@Data
public class ChannelInfo {
    private int type;
    private String messageType;
    private Map<String,String> config;

    @Data
    public static class Config {
        private String name;
        private String defaultValue;
    }
}
