package com.yimiyisu.kooteam.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DeepSeekResponse {
    private String id; // 对话唯一标识
    private String object;
    private Long created;
    private String model;
    private List<Choice> choices;
    private Usage usage; // 请求用量信息

    // 便捷方法：获取第一个回复内容
    public String getFirstMessageContent() {
        if (choices != null && !choices.isEmpty()) {
            Choice firstChoice = choices.get(0);
            if (firstChoice != null && firstChoice.getMessage() != null) return firstChoice.getMessage().getContent();
        }
        return null;
    }

    @Data
    public static class Choice {
        private Integer index;
        private Message message;
        private String finishReason;
    }

    @Data
    public static class Message {
        private String role;
        private String content;
        private String refusal;
    }

    @Data
    public static class Usage {
        private Integer promptTokens;
        private Integer completionTokens;
        private Integer totalTokens;
    }
}