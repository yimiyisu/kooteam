package com.yimiyisu.kooteam.events.department.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentEventModel {
    private String departmentId;
    private String title;
    private String parentId;
    private String order;
    private List<String> departmentLeader;
    private String isLeaf;
    private String code;
}



