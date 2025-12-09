package com.yimiyisu.kooteam.kit.openPlatform;

import com.yimiyisu.kooteam.domain.DepartmentDO;
import com.yimiyisu.kooteam.domain.DepartmentUserDO;
import com.yimiyisu.kooteam.domain.openPlatformAccessToken.DingTokenRes;
import com.yimiyisu.kooteam.domain.openPlatformResult.DingUserInfo;
import com.yimiyisu.kooteam.domain.openPlatformResult.DingdingDepartmentResult;
import com.yimiyisu.kooteam.domain.openPlatformResult.DingdingUserResult;
import com.yimiyisu.kooteam.domain.openPlatformResult.SnsUserInfo;
import com.zen.domain.ZenUser;
import com.zen.enums.UserBasicTag;
import com.zen.enums.ZenRole;
import com.zen.kit.*;
import me.zhyd.oauth.config.AuthConfig;
import me.zhyd.oauth.request.AuthDingTalkV2Request;
import me.zhyd.oauth.request.AuthRequest;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.util.*;

public class DingdingPlatform implements IOpenPlatform {
    private static final String TOKEN_KEY = "DINGDING_TOKEN";

    @Override
    public void refreshToken() {

    }

    @Override
    public void completeUser(ZenUser user) {

    }

    public static String login() {
        AuthRequest authRequest = new AuthDingTalkV2Request(AuthConfig.builder()
                .clientId(ConfigKit.get("dingClientId"))
                .clientSecret(ConfigKit.get("dingSecret"))
                .redirectUri(ConfigKit.get("appDomain") + "/kooteam/api/oAuth/callback")
                .build());
        return authRequest.authorize("dingding");
    }

    public String getUserToken(String authCode) {
        String url = "https://api.dingtalk.com/v1.0/oauth2/userAccessToken";
        Map<String, Object> body = new HashMap<>();
        body.put("clientId", ConfigKit.get("dingClientId"));
        body.put("clientSecret", ConfigKit.get("dingSecret"));
        body.put("grantType", "authorization_code");
        body.put("code", authCode);
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        Map<String, Object> stringObjectMap = HttpKit.postAsMapWidthHeader(url, body, headers);
        return stringObjectMap.get("accessToken").toString();
    }

    public String getAccessToken() {
        String token = CacheKit.get(DingdingPlatform.TOKEN_KEY);
        if (StringKit.isNotEmpty(token)) return token;

        String url = "https://api.dingtalk.com/v1.0/oauth2/accessToken";
        Map<String, Object> body = new HashMap<>();
        body.put("appKey", ConfigKit.get("dingClientId"));
        body.put("appSecret", ConfigKit.get("dingSecret"));
        Map<String, String> headers = new HashMap<>();
        headers.put("Content-Type", "application/json");
        String res = HttpKit.postWidthHeader(url, body, headers);
        System.out.println("dingTRes: " + res);
        if (StringKit.isEmpty(res)) return null;
        DingTokenRes dingTokenRes = JsonKit.parse(res, DingTokenRes.class);
        String accessToken = dingTokenRes.getAccessToken();

        if (accessToken != null) {
            token = accessToken;
            // token自动缓存60分钟
            CacheKit.set(DingdingPlatform.TOKEN_KEY, token, 60);
        }
        return token;
    }

    @Override
    public String sendMessage(ZenUser to, String content) {
        return "";
    }

    @Override
    //同步部门数据
    public List<DepartmentDO> syncDepartmentData() {
        String accessToken = getAccessToken();
        List<DepartmentDO> departmentDO = new ArrayList<>();
        Set<Integer> allDepartmentIds = getAllDepartmentIds(accessToken, 1);
        for (Integer departmentId : allDepartmentIds) {
            String geturl = String.format("https://oapi.dingtalk.com/topapi/v2/department/get?access_token=%s&dept_id=%s", accessToken, departmentId);
            String getRes = HttpKit.get(geturl);
            DingdingDepartmentResult dingdingDepartmentResult = JsonKit.parse(getRes, DingdingDepartmentResult.class);
            System.out.println(dingdingDepartmentResult);
            departmentDO.add(DingdingPlatform.toDepartmentDO(dingdingDepartmentResult.getResult()));
        }
        return departmentDO;
    }

    //同步用户数据
    @Override
    public List<DepartmentUserDO> syncUserData(String deptId) {
        String accessToken = getAccessToken();
        Set<DingdingUserResult.DingdingUser> dingdingUserList = new HashSet<>();
        boolean hasMore = true;
        long cursor = 0;
        while (hasMore) {
            String url = String.format(
                    "https://oapi.dingtalk.com/topapi/v2/user/list" +
                            "?access_token=%s" +
                            "&dept_id=%s" +
                            "&cursor=%d" +
                            "&size=100",  // 每页最大100条
                    accessToken, deptId, cursor
            );
            String response = HttpKit.get(url);
            cursor = cursor + 100;
            System.out.println("response = " + response);
            DingdingUserResult dingdingUserResult = JsonKit.parse(response, DingdingUserResult.class);
            dingdingUserList.addAll(dingdingUserResult.getResult().getList());
            System.out.println(dingdingUserList);
            hasMore = dingdingUserResult.getResult().isHas_more();
        }
        return dingdingUserList.parallelStream()
                .map(DingdingPlatform::toDepartmentUserDO)
                .toList();
    }

    //获取子部门ID列表
    public Set<Integer> getAllDepartmentIds(String accessToken, int rootId) {
        Set<Integer> allIds = new HashSet<>();
        Queue<Integer> queue = new LinkedList<>();
        queue.add(rootId);
        allIds.add(rootId);
        while (!queue.isEmpty()) {
            int currentId = queue.poll();
            String listUrl = String.format("https://oapi.dingtalk.com/topapi/v2/department/listsubid?access_token=%s&dept_id=%s", accessToken, currentId);
            String res = HttpKit.get(listUrl);
            System.out.println(res);
            DingdingDepartmentResult dingdingDepartmentResult = JsonKit.parse(HttpKit.get(listUrl), DingdingDepartmentResult.class);
            if (dingdingDepartmentResult.getResult().getDept_id_list() != null)
                for (String id : dingdingDepartmentResult.getResult().getDept_id_list()) {
                    int subId = Integer.parseInt(id);
                    if (allIds.add(subId)) queue.add(subId);// 添加成功说明是新的ID
                }
        }
        return allIds;
    }

    //转化部门DO
    private static DepartmentDO toDepartmentDO(DingdingDepartmentResult.Result result) {
        DepartmentDO departmentDo = new DepartmentDO();
        // 直接映射字段
        departmentDo.setOutId(result.getDept_id());
        departmentDo.setTitle(result.getName());
        departmentDo.setOrder(result.getOrder());
        // 处理根节点
        departmentDo.setOutParentId(
                (result.getParent_id() == null || result.getParent_id().isEmpty()) ? "0" : result.getParent_id());
        return departmentDo;
    }

    //转化为员工DO
    private static DepartmentUserDO toDepartmentUserDO(DingdingUserResult.DingdingUser result) {
        DepartmentUserDO departmentUserDo = new DepartmentUserDO();
        // 直接映射字段
        departmentUserDo.setUserId(result.getUserid());
        departmentUserDo.setTitle(result.getName());
        departmentUserDo.setDepartmentId(result.getDept_id_list());
        departmentUserDo.setEmail((result.getEmail() == null || result.getEmail().isEmpty()) ? "" : result.getEmail());
        departmentUserDo.setMobile((result.getMobile() == null || result.getMobile().isEmpty()) ? "" : result.getMobile());
        departmentUserDo.setRole((result.getTitle() == null || result.getTitle().isEmpty()) ? "员工" : result.getTitle());
        return departmentUserDo;
    }

    public String getToken(String authCode) throws Exception {
        if (StringKit.isEmpty(authCode)) return null;
        // 获取token
        String accessToken = getAccessToken();
        if (StringKit.isEmpty(accessToken)) return null;

        // 通过免登码获取用户信息-unionid
//        Map<String, Object> getUserMap = new HashMap<>();
//        getUserMap.put("code", authCode);
//        String getUnionidUrl = "https://oapi.dingtalk.com/topapi/v2/user/getuserinfo?access_token=" + accessToken;
//        String unionRes = HttpKit.post(getUnionidUrl, getUserMap);
//        System.out.println("user: " + unionRes);
//        if (StringKit.isEmpty(unionRes)) return null;
//        DingUserInfo userResult = JsonKit.parse(unionRes, DingUserInfo.class);
//        if (userResult.getErrcode() == null || userResult.getErrcode() != 0) return null;
//        String openId = userResult.getResult().getUnionid();
        String timestamp = System.currentTimeMillis() + "";
        String signature = DingdingPlatform.sign(timestamp);
        String url = "https://oapi.dingtalk.com/sns/getuserinfo_bycode?accessKey=" + ConfigKit.get("dingClientId") + "&timestamp=" + timestamp + "&signature=" + signature;
        Map<String, Object> params = new HashMap<>();
        params.put("tmp_auth_code", authCode);
        String post = HttpKit.post(url, params);
        System.out.println("post = " + post);
        if (StringKit.isEmpty(post)) return null;
        SnsUserInfo parse = JsonKit.parse(post, SnsUserInfo.class);
        String openId = parse.getUser_info().getUnionid();

        // 通过unionid获取用户信息
        Map<String, Object> body = new HashMap<>();
        body.put("unionid", openId);
        String getUserUrl = "https://oapi.dingtalk.com/topapi/user/getbyunionid?access_token=" + accessToken;
        String userInfo = HttpKit.post(getUserUrl, body);
        if (StringKit.isEmpty(userInfo)) return null;
        DingUserInfo user = JsonKit.parse(userInfo, DingUserInfo.class);
        if (user.getErrcode() != 0) return null;
        int contactType = user.getResult().getContact_type();

        String token = "";
        if (contactType == 0) return null;
        else if (contactType == 1) { // 是企业员工
            ZenUser zenUser = UserKit.getByOpenId(openId, UserBasicTag.DING.value());
            if (zenUser == null) {
                ZenUser newUser = new ZenUser();
                newUser.setOpenId(openId);
                newUser.addTag(UserBasicTag.DING);
                newUser.setRole(ZenRole.CONSOLE);
                token = UserKit.insert(newUser);
            } else token = UserKit.createToken(zenUser.getId());
        }

        return token;
    }

    private static String sign(String timestamp) throws Exception {
        String appSecret = ConfigKit.get("dingSecret");
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(appSecret.getBytes("UTF-8"), "HmacSHA256"));
        byte[] signatureBytes = mac.doFinal(timestamp.getBytes("UTF-8"));
        String signature = Base64.getEncoder().encodeToString(signatureBytes);
        if ("".equals(signature)) return "";
        String encoded = URLEncoder.encode(signature, "UTF-8");
        String urlEncodeSignature = encoded.replace("+", "%20").replace("*", "%2A").replace("~", "%7E").replace("/", "%2F");
        return urlEncodeSignature;
    }
}
