package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DingdingDepartmentResult {
    // 错误码
    private Integer errcode;
    // 错误信息
    private String errmsg;
    // 返回结果
    private Result result;
    //
    private String request_id;

    @Data
    @AllArgsConstructor
    public static class Result {
        // 部门id
        private String dept_id;
        // 部门名称
        private String name;
        // 父部门id
        private String parent_id;
        // 排序
        private String order;
        // 部门负责人列表
        private List<String> dept_manager_userid_list;
        // 子部门列表
        private List<String> dept_id_list;
    }


}
