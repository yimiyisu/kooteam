package com.yimiyisu.kooteam.kit.openPlatform;

import com.yimiyisu.kooteam.domain.DepartmentDO;
import com.yimiyisu.kooteam.domain.DepartmentUserDO;
import com.yimiyisu.kooteam.domain.openPlatformResult.WeWorkDepartmentResult;
import com.yimiyisu.kooteam.domain.openPlatformResult.WeWorkResult;
import com.yimiyisu.kooteam.domain.openPlatformResult.WeWorkUserResult;
import com.zen.domain.ZenUser;
import com.zen.kit.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;


public class WeworkPlatform implements IOpenPlatform {
    private static final String TOKEN_KEY = "WEWORK_TOKEN";

    @Override
    public void refreshToken() {
    }

    @Override
    public void completeUser(ZenUser user) {
        if (StringKit.isEmpty(user.getOpenId())) return;
        String token = this.getAccessToken();
        String url = "https://qyapi.weixin.qq.com/cgi-bin/user/get?userid=" + user.getOpenId() + "&access_token=" + token;
        Map<String, Object> result = HttpKit.getAsMap(url);
        if (result.containsKey("userId")) {
            if (result.containsKey("avatar")) {
                String avatar = result.get("avatar").toString();
                // 把平台头像缓存到本地
                avatar = UploadKit.image(avatar, "/user/" + user.getId() + ".jpg");
                user.setAvatar(avatar);
            }
            if (result.containsKey("email")) {
                user.setEmail(result.get("email").toString());
            }
            UserKit.update(user);
        }
        System.out.println(result);
    }

    public String getAccessToken() {
        String token = CacheKit.get(WeworkPlatform.TOKEN_KEY);
        if (StringKit.isNotEmpty(token)) return token;
        String corpId = ConfigKit.get("weworkId");
        String corpSecret = ConfigKit.get("weworkAppSecret");
        String url = "https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=" + corpId + "&corpsecret=" + corpSecret;
        Map<String, Object> result = HttpKit.getAsMap(url);
        if (result.containsKey("access_token")) {
            token = result.get("access_token").toString();
            CacheKit.set(WeworkPlatform.TOKEN_KEY, token);
        }
        return token;
    }

    @Override
    public String sendMessage(ZenUser to, String content) {
        return "";
    }

    // 从企业微信API获取部门数据
    @Override
    public List<DepartmentDO> syncDepartmentData(){
        String accessToken = getAccessToken();
        List<WeWorkResult.Result> weWorkResult = getWeWorkDeptId(accessToken);
        String geturl = "https://qyapi.weixin.qq.com/cgi-bin/department/get?access_token=";
        List<WeWorkDepartmentResult.Result> weDeptResult = new ArrayList<>();
        for (WeWorkResult.Result result : weWorkResult) {
            String getresponse = HttpKit.get(geturl + accessToken + "&id=" + result.getId());
            WeWorkDepartmentResult weWorkDepartmentResult = JsonKit.parse(getresponse, WeWorkDepartmentResult.class);
            weDeptResult.add(weWorkDepartmentResult.getDepartment());
        }
        List<DepartmentDO> departmentList = weDeptResult.parallelStream()
                .map(WeworkPlatform::toDepartmentDO)
                .collect(Collectors.toList());
        System.out.println(departmentList);
        return departmentList;
    }

    // 从企业微信API获取部门员工数据
    @Override
    public List<DepartmentUserDO> syncUserData(String departmentId){
        String accessToken = getAccessToken();
        String url = "https://qyapi.weixin.qq.com/cgi-bin/user/list?access_token=";
        String response = HttpKit.get(url + accessToken + "&department_id=" + departmentId);
        WeWorkUserResult weWorkUserResult = JsonKit.parse(response, WeWorkUserResult.class);
        List<WeWorkUserResult.UserResult> userList = new ArrayList<>();
        if (weWorkUserResult != null){
            userList = weWorkUserResult.getUserlist();
        }
        return userList.parallelStream()
                .map(WeworkPlatform::toDepartmentUserDO)
                .collect(Collectors.toList());
    }

    //获取部门id
    private List<WeWorkResult.Result> getWeWorkDeptId(String accessToken) {
        String url = "https://qyapi.weixin.qq.com/cgi-bin/department/simplelist?access_token=";
        String response = HttpKit.get(url + accessToken);
        WeWorkResult weWorkDept = JsonKit.parse(response, WeWorkResult.class);
        return weWorkDept.getDepartment_id();
    }

    //转化为部门DO
    private static DepartmentDO toDepartmentDO(WeWorkDepartmentResult.Result result) {
        DepartmentDO departmentDo = new DepartmentDO();
        // 直接映射字段
        departmentDo.setOutId(result.getId());
        departmentDo.setTitle(result.getName());
        departmentDo.setOrder(result.getOrder());
        // 处理根节点
        departmentDo.setOutParentId(
                (result.getParentid() == null) ? "0" : result.getParentid());
        return departmentDo;
    }

    //转化为员工DO
    private static DepartmentUserDO toDepartmentUserDO(WeWorkUserResult.UserResult result) {
        DepartmentUserDO departmentUserDo = new DepartmentUserDO();
        // 直接映射字段
        departmentUserDo.setUserId(result.getUserid());
        departmentUserDo.setTitle(result.getName());
        departmentUserDo.setDepartmentId(result.getDepartment());
        departmentUserDo.setEmail((result.getEmail() == null || result.getEmail().isEmpty()) ? "" : result.getEmail());
        departmentUserDo.setMobile((result.getMobile() == null || result.getMobile().isEmpty()) ? "" : result.getMobile());
        departmentUserDo.setRole((result.getPosition() == null || result.getPosition().isEmpty()) ? "员工" : result.getPosition());
        return departmentUserDo;
    }

}
