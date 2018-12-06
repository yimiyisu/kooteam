package com.zeto.kooteam.dingtalk.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiAuthScopesRequest;
import com.dingtalk.api.request.OapiDepartmentListRequest;
import com.dingtalk.api.request.OapiUserListbypageRequest;
import com.dingtalk.api.response.OapiAuthScopesResponse;
import com.dingtalk.api.response.OapiDepartmentListResponse;
import com.dingtalk.api.response.OapiUserListbypageResponse;
import com.taobao.api.ApiException;
import com.zeto.driver.ZenLoggerEngine;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.dingtalk.domain.DingUserData;
import com.zeto.kooteam.dingtalk.domain.DingUserResult;

import java.util.List;

@Bean
public class DingDepartmentService {
    @Inject
    private ZenLoggerEngine zenLoggerEngine;

    public DingUserResult selectByParent(Long departmentId) {
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/department/list");
        OapiDepartmentListRequest request = new OapiDepartmentListRequest();
        request.setId(departmentId.toString());
        request.setHttpMethod("GET");
        try {
            OapiDepartmentListResponse response = client.execute(request, DingClient.getToken());
            List<OapiDepartmentListResponse.Department> departments = response.getDepartment();
            if (departments == null || departments.isEmpty()) {
                return this.users(departmentId);
            }
            DingUserResult result = new DingUserResult();
            result.setDepartment(true);
            for (OapiDepartmentListResponse.Department department : departments) {
                DingUserData item = new DingUserData();
                item.setId(department.getId().toString());
                item.setName(department.getName());
                result.getData().add(item);
            }
            return result;
        } catch (ApiException e) {
            zenLoggerEngine.exception(e);
        }
        return null;
    }

    private DingUserResult users(Long departmentId) {
        String accessToken = DingClient.getToken();
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/user/listbypage");
        OapiUserListbypageRequest request = new OapiUserListbypageRequest();
        request.setDepartmentId(departmentId);
        request.setOffset(0L);
        request.setSize(100L);
        request.setOrder("entry_desc");
        request.setHttpMethod("GET");
        DingUserResult result = new DingUserResult();
        result.setDepartment(false);
        try {
            OapiUserListbypageResponse response = client.execute(request, accessToken);
            List<OapiUserListbypageResponse.Userlist> userlist = response.getUserlist();
            for (OapiUserListbypageResponse.Userlist user : userlist) {
                DingUserData item = new DingUserData();
                item.setId(user.getUserid());
                item.setName(user.getName());
                item.setAvator(user.getAvatar());
                item.setDingId(user.getUnionid());
                result.getData().add(item);
            }
        } catch (ApiException e) {
            e.printStackTrace();
        }
        return result;
    }

    public Object range() {
        String accessToken = DingClient.getToken();
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/auth/scopes");
        OapiAuthScopesRequest request = new OapiAuthScopesRequest();
        request.setHttpMethod("GET");
        try {
            OapiAuthScopesResponse response = client.execute(request, accessToken);
            return response;
        } catch (Exception e) {
            zenLoggerEngine.exception(e);
        }
        return null;
    }

    public Object get(Long departmendId) {
        String accessToken = DingClient.getToken();
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/auth/scopes");
        OapiAuthScopesRequest request = new OapiAuthScopesRequest();
        request.setHttpMethod("GET");
        try {
            OapiAuthScopesResponse response = client.execute(request, accessToken);
            return response;
        } catch (Exception e) {
            zenLoggerEngine.exception(e);
        }
        return null;
    }
}
