package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;


@Data
@AllArgsConstructor
public class FeishuDepartment {
    //部门id
    private String department_id;
    //部门名称
    private String name;
    //父部门id
    private String parent_department_id;
    //部门主管id
    private String leader_user_id;
    //排序
    private String order;
    //国际化部门名称
    private department_i18n_name i18n_name;
    //部门负责人
    private List<departmentLeader> leaders;
    //部门状态
    private status status;

    @Data
    @AllArgsConstructor
    public static class status {
        //是否删除
        private Boolean is_deleted;
    }

    @Data
    @AllArgsConstructor
    public static class department_i18n_name {
        //中文
        private String zh_cn;
        //英文
        private String en_us;
        //日文
        private String ja_jp;
    }

    @Data
    @AllArgsConstructor
    public static class departmentLeader {
        //部门负责人类型
        private Integer leaderType;
        //部门负责人userid
        private String leaderID;
    }
}
