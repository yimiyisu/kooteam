package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class WeWorkResult {
    // 0表示成功，非0表示失败
    private Integer errcode;
    // 错误信息
    private String errmsg;
    // 返回结果
    private List<Result> department_id;

    @Data
    @AllArgsConstructor
    public static class Result {
        // 部门id列表
        private String id;
        private String parentid;
        private String order;
    }
}
