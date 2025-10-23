package com.yimiyisu.kooteam.events.department.model;

import com.zen.kit.DateKit;
import lombok.Data;

@Data
public class DepartmentLoopEventModel {
    private long now;
    private String name = "DepartmentLoopEventModel";

    public DepartmentLoopEventModel() {
        this.now = DateKit.now();
    }
}
