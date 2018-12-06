package com.zeto.kooteam.service.install;

import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.DingTalkClient;
import com.dingtalk.api.request.*;
import com.dingtalk.api.response.OapiGettokenResponse;
import com.dingtalk.api.response.OapiMediaUploadResponse;
import com.dingtalk.api.response.OapiMicroappCreateResponse;
import com.dingtalk.api.response.OapiMicroappListResponse;
import com.google.common.base.Strings;
import com.taobao.api.ApiException;
import com.taobao.api.FileItem;
import com.zeto.*;
import com.zeto.domain.ZenAction;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.domain.AppConf;
import com.zeto.kooteam.service.domain.DingApp;
import com.zeto.util.GsonUtil;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;

public class DingTalkValidate {

    public static ZenResult check(ZenData data) {
        AppConf conf = ZenCache.get(AppConf.cacheKey, AppConf.class);
        if (conf == null) {
            conf = new AppConf();
        }
        conf.setDingCorpId(data.get("dingCorpId"));
        conf.setDingSecret(data.get("dingSecret"));
        conf.setDomain(data.get("domain"));
        String dingAppName = data.get("dingAppName");
        if (!Strings.isNullOrEmpty(dingAppName)) {
            conf.setDingAppName(dingAppName);
        }

        return testDingTalk(conf);
    }

    private static ZenResult testDingTalk(AppConf conf) {
        conf.setDingCheck(false);
        String apiURL = "https://oapi.dingtalk.com/gettoken";
        DefaultDingTalkClient client = new DefaultDingTalkClient(apiURL);
        OapiGettokenRequest request = new OapiGettokenRequest();
        request.setAppkey(conf.getDingCorpId());
        request.setAppsecret(conf.getDingSecret());
        request.setHttpMethod("GET");
        try {
            OapiGettokenResponse response = client.execute(request);
            String token = response.getAccessToken();
            if (token == null) {
                return ZenResult.fail("dingCorpId或dingSecret配置错误");
            }
            if (!getAppInfo(conf, token)) {
                createMApp(conf, token);
            }
            conf.setDingCheck(true);
            ZenCache.set(AppConf.cacheKey, conf);
            return ZenResult.success("恭喜你钉钉配置成功！").setAction(ZenAction.SILENT);
        } catch (Exception ex) {
            ZenResult.error(ex);
        }
        conf.setDingCheck(false);
        ZenCache.set(AppConf.cacheKey, conf);
        return ZenResult.fail("钉钉配置错误");
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

    private static void createMApp(AppConf conf, String token) {
        String icon = uploadIcon(token);
        DingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/microapp/create");
        OapiMicroappCreateRequest req = new OapiMicroappCreateRequest();
        req.setAppName(conf.getDingAppName());
        req.setAppIcon(icon);
        req.setAppDesc("Kooteam");
        req.setHomepageUrl(conf.getDomain() + "/ding/home.wap");
        try {
            OapiMicroappCreateResponse response = client.execute(req, token);
            conf.setDingAgentId(response.getAgentid());
            conf.setDingAppId(response.getSubCode());
        } catch (ApiException e) {
            e.printStackTrace();
        }
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

    public static void Serialize(AppConf conf) {
        DingApp dingApp = new DingApp();
        dingApp.setCorpId(conf.getDingCorpId());
        dingApp.setAppId(conf.getDingAppId());
        dingApp.setAgentId(conf.getDingAgentId());
        dingApp.setName(conf.getDingAppName());
        dingApp.setHost(conf.getDomain());

        String configPath = ZenEnvironment.getPath() + "/" + ZenEnvironment.getAppName() + ".json";// 文件配置路径
        EventBiz.employeeSync();
        // 初始化文件写入到配置文件中
        String content = GsonUtil.stringify(dingApp);
        File writename = new File(configPath); // 相对路径，如果没有则要建立一个新的output。txt文件
        try {
            // 不能写入则退出
            if (!writename.createNewFile()) {
                return;
            }
            BufferedWriter out = new BufferedWriter(new FileWriter(writename));
            out.write(content);
            out.flush(); // 把缓存区内容压入文件
            out.close(); // 最后记得关闭文件
        } catch (IOException e) {
            Zen.getLoggerEngine().exception(e);
        }
    }

    // 查询E应用信息，查询不到则创建
    private static boolean getAppInfo(AppConf conf, String token) throws ApiException {
        String apiURL = "https://oapi.dingtalk.com/microapp/list";
        DefaultDingTalkClient client = new DefaultDingTalkClient(apiURL);
        OapiMicroappListRequest req = new OapiMicroappListRequest();
        String appName = conf.getDingAppName();
        OapiMicroappListResponse response = client.execute(req, token);
        List<OapiMicroappListResponse.Applist> applists = response.getAppList();
        for (OapiMicroappListResponse.Applist app : applists) {
            if (app.getName().equals(appName)) {
                String link = app.getHomepageLink();
                conf.setDingAgentId(app.getAgentId());
                if (!link.contains(conf.getDomain())) {
                    updateDomain(conf.getDomain(), app, token);
                }
                return true;
            }
        }

        return false;
    }
}
