package com.yimiyisu.kooteam.domain.enums;


import lombok.Getter;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Getter
public enum ThingStatus {
    NOT_STARTED(0, "未开始"),
    IN_PROGRESS(2, "进行中"),
    COMPLETED(6, "已完成");

    private final int value;
    private final String label;

    private static final Map<Integer, ThingStatus> VALUE_MAP =
            Arrays.stream(values())
                    .collect(Collectors.toMap(ThingStatus::getValue, Function.identity()));

    ThingStatus(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public static String getLabelByValue(int value) {
        return getByValue(value).label;
    }

    public static ThingStatus getByValue(int value) {
        return VALUE_MAP.get(value);
    }
}
