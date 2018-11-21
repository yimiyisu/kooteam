package com.zeto.kooteam.service.domain;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode
public class ProjectStat {
    //未完成数
    private long unfinish;
    // 已完成数
    private long finished;
    // 未安排用户
    private long unuser;
    // 超期未完成任务
    private long overtime;
}
