package com.yimiyisu.kooteam.domain;

import lombok.Data;

@Data
public class WorkDayDO {
    private int code;
    private WorkDayType type;

    @Data
    public static class WorkDayType {
        private int type;
        private String name;
        private int week;
    }
}
