package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class DingDingResult {
    // 0表示成功，非0表示失败
    private Integer errcode;
    // 错误信息
    private String errmsg;
    // 返回结果
    private Result result;
    // 请求id
    private String request_id;

    @Data
    @AllArgsConstructor
    public static class Result {
        // 部门id列表
        private List<String> dept_id_list;
    }
}
