package com.yimiyisu.kooteam.kit.openPlatform;

import com.yimiyisu.kooteam.domain.DepartmentDO;
import com.yimiyisu.kooteam.domain.DepartmentUserDO;
import com.yimiyisu.kooteam.domain.openPlatformAccessToken.FeishuAccessToken;
import com.yimiyisu.kooteam.domain.openPlatformResult.FeishuDepartment;
import com.yimiyisu.kooteam.domain.openPlatformResult.FeishuResult;
import com.zen.domain.ZenUser;
import com.zen.kit.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class FeishuPlatform implements IOpenPlatform {
    private static final String TOKEN_KEY = "FEISHU_TOKEN";

    @Override
    public void refreshToken() {

    }

    @Override
    public void completeUser(ZenUser user) {

    }

    @Override
    public String getAccessToken() {
        String token = CacheKit.get(FeishuPlatform.TOKEN_KEY);
        if (StringKit.isNotEmpty(token)) return token;
        String appId = ConfigKit.get("feishuAppId");
        String appSecret = ConfigKit.get("feishuAppSecret");
        Map<String, Object> reqBody = new HashMap<>();
        reqBody.put("app_id", appId);
        reqBody.put("app_secret", appSecret);
        String url = "https://open.feishu.cn/open-apis/auth/v3/app_access_token/internal";
        FeishuAccessToken accessToken = HttpKit.post(url, reqBody, FeishuAccessToken.class);
        if (accessToken != null) {
            token = accessToken.getTenant_access_token();
            // token自动缓存60分钟
            CacheKit.set(FeishuPlatform.TOKEN_KEY, token, 60);
        }
        return token;
    }

    @Override
    public String sendMessage(ZenUser to, String content) {
        return "";
    }

    // 从飞书API获取部门数据
    @Override
    public List<DepartmentDO> syncDepartmentData() {
        String accessToken = getAccessToken();
        String url = "https://open.feishu.cn/open-apis/contact/v3/departments/0/children?&user_id_type=user_id&" +
                "department_id_type=department_id&fetch_child=true";
        Map<String, String> head = new HashMap<>();
        head.put("Authorization", "Bearer " + accessToken);
        String feishuResponse = HttpKit.getWithHeader(url, head);
        System.out.println(feishuResponse);
        FeishuResult feishuResult = JsonKit.parse(feishuResponse, FeishuResult.class);
        List<FeishuDepartment> feishuDepartments = feishuResult.getData().getItems();
        for (FeishuDepartment feishuDepartment : feishuDepartments) System.out.println(feishuDepartment);
        List<DepartmentDO> departmentList = feishuDepartments.parallelStream()
                .map(FeishuPlatform::toDepartmentDO)
                .collect(Collectors.toList());
        System.out.println(departmentList);
        return departmentList;
    }

    @Override
    public List<DepartmentUserDO> syncUserData(String deptId) {
        return List.of();
    }

    //转化为部门DO
    private static DepartmentDO toDepartmentDO(FeishuDepartment feishuDepartment) {
        DepartmentDO departmentDo = new DepartmentDO();
//        // 直接映射字段
//        departmentDo.setOutId(result.getId());
//        departmentDo.setTitle(result.getName());
//        departmentDo.setOrder(result.getOrder());
//        // 处理根节点
//        departmentDo.setOutParentId(
//                (result.getParentid() == null) ? "0" : result.getParentid());
        return departmentDo;
    }

}
