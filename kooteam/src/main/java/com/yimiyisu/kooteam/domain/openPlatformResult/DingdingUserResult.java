package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DingdingUserResult {
    private Integer errcode;
    private String errmsg;
    private DingdingUserPageResult result;

    @Data
    public static class DingdingUserPageResult{
        private boolean has_more;//是否还有更多的数据：
        private int next_cursor;//下一次分页的游标。
        private List<DingdingUser> list;
    }

    @Data
    public static class DingdingUser{
        private String userid; //用户的userId
        private String unionid; //用户在当前开发者企业账号范围内的唯一标识。
        private String name; //用户姓名。
        private String avatar; //头像地址
        private String mobile; //手机号
        private String job_number; //员工工号
        private String title; //职位
        private String email; //邮箱
        private String org_email; //企业邮箱
        private List<String> dept_id_list; //所属部门id列表。
        private boolean admin;//是否为企业的管理员：
        private boolean boss;//是否为企业的老板
        private boolean leader;//是否是部门的主管
    }
}
