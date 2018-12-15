package com.zeto.kooteam.service.install;

import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.DingTalkClient;
import com.dingtalk.api.request.*;
import com.dingtalk.api.response.OapiGettokenResponse;
import com.dingtalk.api.response.OapiMediaUploadResponse;
import com.dingtalk.api.response.OapiMicroappCreateResponse;
import com.dingtalk.api.response.OapiMicroappListResponse;
import com.taobao.api.ApiException;
import com.taobao.api.FileItem;
import com.zeto.ZenCache;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.domain.DingApp;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.util.List;
import java.util.Properties;

public class DingTalkValidate {

    private final static String dingAppName = "Kooteam";
    private final static String dingConfigKey = "DingConfigKey";

    public static boolean check(String corpId, String secret, String domain) {
        String apiURL = "https://oapi.dingtalk.com/gettoken";
        DefaultDingTalkClient client = new DefaultDingTalkClient(apiURL);
        OapiGettokenRequest request = new OapiGettokenRequest();
        request.setAppkey(corpId);
        request.setAppsecret(secret);
        request.setHttpMethod("GET");
        try {
            OapiGettokenResponse response = client.execute(request);
            String token = response.getAccessToken();
            if (token == null) {
                return false;
            }
            DingApp dingApp = getAppInfo(domain, token);
            if (dingApp == null) {
                dingApp = createMApp(domain, token);
            }
            if (dingApp == null) {
                return false;
            }
            dingApp.setSecret(secret);
            dingApp.setCorpId(corpId);
            dingApp.setHost(domain);
            ZenCache.set(dingConfigKey, dingApp);
            return true;
        } catch (Exception ex) {
            ZenResult.error(ex);
        }
        return false;
    }

    private static void updateDomain(String domain, OapiMicroappListResponse.Applist app, String token) {
        DingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/microapp/update");
        OapiMicroappUpdateRequest req = new OapiMicroappUpdateRequest();
        req.setAppName(app.getName());
        req.setAppIcon(app.getAppIcon());
        req.setAppDesc(app.getAppDesc());
        req.setHomepageUrl(domain + "/ding/home.wap");
        req.setAgentId(app.getAgentId());
        try {
            client.execute(req, token);
        } catch (ApiException e) {
            e.printStackTrace();
        }
    }

    private static DingApp createMApp(String domain, String token) {
        String icon = uploadIcon(token);
        DingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/microapp/create");
        OapiMicroappCreateRequest req = new OapiMicroappCreateRequest();
        req.setAppName(dingAppName);
        req.setAppIcon(icon);
        req.setAppDesc("Kooteam");
        req.setHomepageUrl(domain + "/ding/home.wap");
        try {
            OapiMicroappCreateResponse response = client.execute(req, token);
            if (!response.isSuccess()) {
                return null;
            }
            DingApp dingApp = new DingApp();
            dingApp.setAgentId(response.getAgentid());
            return dingApp;
        } catch (ApiException e) {
            e.printStackTrace();
        }
        return null;
    }

    private static String uploadIcon(String token) {
        DingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/media/upload");
        OapiMediaUploadRequest request = new OapiMediaUploadRequest();
        request.setType("image");
        String filePath = ZenEnvironment.getPath() + "/logo.png";
        request.setMedia(new FileItem(filePath));
        try {
            OapiMediaUploadResponse response = client.execute(request, token);
            return response.getMediaId();
        } catch (ApiException e) {
            e.printStackTrace();
        }
        return null;
    }

    public static void Serialize() {
        DingApp dingApp = ZenCache.getWithClean(dingConfigKey, DingApp.class);
        if (dingApp == null) {
            return;
        }
        String profilepath = ZenEnvironment.getPath() + "/app.properties";
        try {
            File propFile = new File(profilepath);
            if (!propFile.exists()) {
                return;
            }
            Properties props = new Properties();
            props.load(new FileInputStream(profilepath));
            props.setProperty("mode", "4");
            props.setProperty("dingDomain", dingApp.getHost());
            props.setProperty("dingAgentId", dingApp.getAgentId().toString());
            props.setProperty("dingCorpId", dingApp.getCorpId());
            OutputStream fos = new FileOutputStream(profilepath);
            props.store(fos, "Ding Set");
            fos.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        DingClient.init();
        EventBiz.employeeSync();
    }

    // 查询E应用信息，查询不到则创建
    private static DingApp getAppInfo(String domain, String token) throws ApiException {
        String apiURL = "https://oapi.dingtalk.com/microapp/list";
        DefaultDingTalkClient client = new DefaultDingTalkClient(apiURL);
        OapiMicroappListRequest req = new OapiMicroappListRequest();

        OapiMicroappListResponse response = client.execute(req, token);
        List<OapiMicroappListResponse.Applist> applists = response.getAppList();
        for (OapiMicroappListResponse.Applist app : applists) {
            if (app.getName().equals(dingAppName)) {
                DingApp dingApp = new DingApp();
                dingApp.setAgentId(app.getAgentId());
                String link = app.getHomepageLink();
                if (!link.contains(domain)) {
                    updateDomain(domain, app, token);
                }
                return dingApp;
            }
        }
        return null;
    }
}
