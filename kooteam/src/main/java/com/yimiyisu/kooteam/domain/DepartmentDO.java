package com.yimiyisu.kooteam.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Data
@ToString
@AllArgsConstructor
@NoArgsConstructor
public class DepartmentDO {
    /*
    kooteam里的部门ID，可以提前预生成
     */
    private String id;
    private String outId;
    private String title;
    private String outParentId;
    private String parentId;
    private String order;
}
