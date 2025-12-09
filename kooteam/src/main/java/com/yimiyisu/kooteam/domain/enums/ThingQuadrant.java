package com.yimiyisu.kooteam.domain.enums;

import lombok.Getter;

import java.util.Arrays;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Getter
public enum ThingQuadrant {
    P1(1, "重要且紧急(P1)"),
    P2(2, "重要不紧急(P2)"),
    P3(3, "紧急不重要(P3)"),
    P4(4, "不紧急不重要(P4)");

    private final int value;
    private final String label;

    private static final Map<Integer, ThingQuadrant> VALUE_MAP =
            Arrays.stream(values())
                    .collect(Collectors.toMap(ThingQuadrant::getValue, Function.identity()));

    ThingQuadrant(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public static String getLabelByValue(int value) {
        return getByValue(value).label;
    }

    public static ThingQuadrant getByValue(int value) {
        return VALUE_MAP.get(value);
    }
}
