package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class WeWorkUserResult {
    private Integer errcode;
    private String errmsg;
    private List<UserResult> userlist;

    @Data
    @AllArgsConstructor
    public static class UserResult {
        private String userid;
        private String name;
        private String mobile;
        private List<String> department;
        private String position;
        private String email;
        private List<String> is_leader_in_dept;
        private String status;
        private String open_userid;
    }
}
