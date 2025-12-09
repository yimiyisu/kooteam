package com.yimiyisu.kooteam.domain;

import lombok.Data;

/**
 * @author Z-熙玉
 * @version 1.0
 */
@Data
public class ThreadInfoDo {
    private long threadId;
    private String threadName;
    private Thread.State threadState;
    private float cpuTime;
}
