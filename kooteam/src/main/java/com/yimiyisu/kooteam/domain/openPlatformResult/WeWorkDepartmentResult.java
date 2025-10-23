package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class WeWorkDepartmentResult {
    // 错误码
    private Integer errcode;
    // 错误信息
    private String errmsg;
    // 返回结果
    private Result department;

    @Data
    @AllArgsConstructor
    public static class Result {
        // 部门id
        private String id;
        // 部门名称
        private String name;
        //英文名称
        private String name_en;
        // 父部门id
        private String parentid;
        // 排序
        private String order;
        // 部门负责人列表
        private List<String> department_leader;
    }
}
