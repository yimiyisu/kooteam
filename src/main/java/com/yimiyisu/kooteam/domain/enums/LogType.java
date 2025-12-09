package com.yimiyisu.kooteam.domain.enums;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

public enum LogType {

    UPDATE_OWNER(1, "修改负责人", "你有新的待办，请及时查看。"),
    UPDATE_STATUS(2, "修改任务状态", "你关注的任务状态发生了改变。"),
    ADD_COMMENT(3, "添加@评论", "有人在评论中提及你。"),
    ADD_SONTHING(4, "添加子任务", "你有新的待办，请及时查看。");

    private final int value;
    private final String label;
    private final String message;

    LogType(int value, String label, String message) {
        this.value = value;
        this.label = label;
        this.message = message;
    }

    public int getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }

    public String getMessage() {
        return message;
    }

    private static final Map<Integer, LogType> VALUE_MAP =
            Arrays.stream(values())
                    .collect(Collectors.toMap(LogType::getValue, Function.identity()));

    /**
     * 根据 value 获取对应的 message
     * @param value 枚举值
     * @return 对应的 message，如果找不到则返回 UNKNOWN 的 message
     */
    public static String getMessageByValue(int value) {
        return getByValue(value).getMessage();
    }

    /**
     * 根据 value 获取对应的枚举实例
     * @param value 枚举值
     * @return 对应的枚举实例，如果找不到则返回 UNKNOWN
     */
    public static LogType getByValue(int value) {
        return VALUE_MAP.get(value);
    }
}
