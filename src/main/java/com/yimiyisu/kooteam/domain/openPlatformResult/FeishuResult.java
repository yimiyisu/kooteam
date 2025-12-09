package com.yimiyisu.kooteam.domain.openPlatformResult;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class FeishuResult {
    //错误码 0表示成功
    private Integer code;
    //错误描述
    private String msg;
    //数据
    private FeishuData data;


    @Data
    @AllArgsConstructor
    public static class FeishuData {
        //是否还有更多数据
        private Boolean has_more;
        //下一页的page_token
        private String page_token;
        //部门列表
        private List<FeishuDepartment> items;
    }
}
