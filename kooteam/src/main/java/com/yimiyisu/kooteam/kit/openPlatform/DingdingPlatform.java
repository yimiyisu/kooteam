package com.yimiyisu.kooteam.kit.openPlatform;

import com.yimiyisu.kooteam.domain.DepartmentDO;
import com.yimiyisu.kooteam.domain.DepartmentUserDO;
import com.yimiyisu.kooteam.domain.openPlatformAccessToken.AccessToken;
import com.yimiyisu.kooteam.domain.openPlatformResult.DingdingDepartmentResult;
import com.yimiyisu.kooteam.domain.openPlatformResult.DingdingUserResult;
import com.zen.domain.ZenUser;
import com.zen.kit.*;

import java.util.*;


public class DingdingPlatform implements IOpenPlatform {
    private static final String TOKEN_KEY = "DINGDING_TOKEN";

    @Override
    public void refreshToken() {

    }

    @Override
    public void completeUser(ZenUser user) {

    }

    public String getAccessToken() {
        String token = CacheKit.get(DingdingPlatform.TOKEN_KEY);
        if (StringKit.isNotEmpty(token)) return token;
        String dingdingId = ConfigKit.get("dingClientId");
        String dingdingSecret = ConfigKit.get("dingSecret");
        String url = "https://oapi.dingtalk.com/gettoken?appkey=" + dingdingId + "&appsecret=" + dingdingSecret;
        AccessToken accessToken = HttpKit.get(url, AccessToken.class);
        if (accessToken != null) {
            token = accessToken.getAccess_token();
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
            departmentDO.add(toDepartmentDO(dingdingDepartmentResult.getResult()));
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
            if (dingdingDepartmentResult.getResult().getDept_id_list() != null) {
                for (String id : dingdingDepartmentResult.getResult().getDept_id_list()) {
                    int subId = Integer.parseInt(id);
                    if (allIds.add(subId)) queue.add(subId);// 添加成功说明是新的ID
                }
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
}
