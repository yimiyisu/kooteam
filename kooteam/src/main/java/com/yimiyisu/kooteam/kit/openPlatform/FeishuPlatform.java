package com.yimiyisu.kooteam.kit.openPlatform;

import com.yimiyisu.kooteam.domain.DepartmentDO;
import com.yimiyisu.kooteam.domain.DepartmentUserDO;
import com.yimiyisu.kooteam.domain.openPlatformAccessToken.FeishuAccessToken;
import com.yimiyisu.kooteam.domain.openPlatformResult.FeishuDepartment;
import com.yimiyisu.kooteam.domain.openPlatformResult.FeishuResult;
import com.yimiyisu.kooteam.domain.openPlatformResult.FeishuUserInfoRes;
import com.yimiyisu.kooteam.domain.openPlatformResult.FeishuUserTokenRes;
import com.zen.domain.ZenUser;
import com.zen.enums.UserBasicTag;
import com.zen.enums.ZenRole;
import com.zen.kit.*;
import me.zhyd.oauth.config.AuthConfig;
import me.zhyd.oauth.request.AuthFeishuRequest;
import me.zhyd.oauth.request.AuthRequest;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class FeishuPlatform implements IOpenPlatform {
    private static final String TOKEN_KEY = "FEISHU_TOKEN";
    private static final String USER_TOKEN_KEY = "feishu:user_token";

    @Override
    public void refreshToken() {

    }

    @Override
    public void completeUser(ZenUser user) {

    }

    public static String login() {
        AuthRequest authRequest = new AuthFeishuRequest(AuthConfig.builder()
                .clientId(ConfigKit.get("feishuAppId"))
                .clientSecret(ConfigKit.get("feishuAppSecret"))
                .redirectUri(ConfigKit.get("appDomain") + "/kooteam/api/oAuth/callback")
                .build());
        return authRequest.authorize("feishu");
    }

    // 获取系统token
    public String getToken(String code, boolean isMobile) {
        // 获取用户token
        String accessToken = getUserAccessToken(code, isMobile);
        if (StringKit.isEmpty(accessToken)) return null;

        // 获取用户信息
        String url = "https://open.feishu.cn/open-apis/authen/v1/user_info";
        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + accessToken);
        headers.put("Content-Type", "application/json; charset=utf-8");
        String userInfoStr = HttpKit.getWithHeader(url, headers);
        if (StringKit.isEmpty(userInfoStr)) return null;
        FeishuUserInfoRes feishuUserInfoRes = JsonKit.parse(userInfoStr, FeishuUserInfoRes.class);
        if (feishuUserInfoRes.getCode() == null || !feishuUserInfoRes.getCode().equals(0)) return null;
        String openId = feishuUserInfoRes.getData().getUser_id(); // 用户id

        // 获取token
        String token = "";
        ZenUser zenUser = UserKit.getByOpenId(openId, UserBasicTag.FEISHU.value());
        if (zenUser == null) {
            ZenUser newUser = new ZenUser();
            newUser.setOpenId(openId);
            newUser.addTag(UserBasicTag.FEISHU);
            newUser.setRole(ZenRole.CONSOLE);
            token = UserKit.insert(newUser);
        } else {
            token = UserKit.createToken(zenUser.getId());
        }
        return token;
    }

    // 获取用户token
    public String getUserAccessToken(String code, boolean isMobile) {
        // 先从缓存取
        if (CacheKit.has(USER_TOKEN_KEY)) return CacheKit.get(USER_TOKEN_KEY);

        // 缓存不存在 - 发送请求
        String url = "https://open.feishu.cn/open-apis/authen/v2/oauth/token";
        // 请求头
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json; charset=utf-8");
        // 请求体
        Map<String, Object> body = new HashMap<>();
        body.put("grant_type", "authorization_code");
        body.put("client_id", ConfigKit.get("feishuAppId"));
        body.put("client_secret", ConfigKit.get("feishuAppSecret"));
        body.put("code", code);
        // 确定重定向uri - 必须与获取code时的保持一致
        String redirectUri = "";
        if (isMobile) redirectUri = ConfigKit.get("appDomain") + "/wap.html"; // 移动端
        else redirectUri = ConfigKit.get("appDomain") + "/kooteam/api/oAuth/callback"; // PC端
        body.put("redirect_uri", redirectUri);
        String tokenRes = HttpKit.postWidthHeader(url, body, headers);

        // 获取token
        if (StringKit.isEmpty(tokenRes)) return null;
        FeishuUserTokenRes feishuUserToken = JsonKit.parse(tokenRes, FeishuUserTokenRes.class);
        if (feishuUserToken.getCode() == null || !feishuUserToken.getCode().equals(0)) return null;
        String token = feishuUserToken.getAccess_token();
        // 存入缓存
        long expiresIn = feishuUserToken.getExpires_in(); // 过期时间(不固定，并不一定是7200)
        CacheKit.set(USER_TOKEN_KEY, token, Integer.parseInt(expiresIn / 60 / 2 + ""));
        return token;
    }

    // 获取应用token
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
