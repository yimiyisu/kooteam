package com.zeto.kooteam.service.install;

import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiGettokenRequest;
import com.dingtalk.api.request.OapiMicroappListRequest;
import com.dingtalk.api.response.OapiGettokenResponse;
import com.dingtalk.api.response.OapiMicroappListResponse;
import com.google.common.base.Strings;
import com.taobao.api.ApiException;
import com.zeto.*;
import com.zeto.domain.ZenAction;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.domain.AppConf;
import com.zeto.kooteam.service.domain.DingApp;
import com.zeto.util.GsonUtil;

import java.io.*;
import java.net.URLDecoder;
import java.util.List;

public class DingTalkValidate {
    private static String token = null;

    public static ZenResult check(ZenData data) {
        AppConf conf = ZenCache.get(AppConf.cacheKey, AppConf.class);
        if (conf == null) {
            conf = new AppConf();
        }
        conf.setDingCorpId(data.get("dingCorpId"));
        conf.setDingSecret(data.get("dingSecret"));
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
            token = response.getAccessToken();
            if (token == null) {
                return ZenResult.fail("dingCorpId或dingSecret配置错误");
            }
            if (!getAppInfo(conf)) {
                return ZenResult.fail("请先在钉钉后台创建名为" + conf.getDingAppName() + "的钉钉E应用");
            }
            conf.setDingCheck(true);
            ZenCache.set(AppConf.cacheKey, conf);
            return ZenResult.success("恭喜你钉钉配置成功！").setAction(ZenAction.SILENT);
        } catch (Exception ex) {
            ZenResult.error(ex);
        }

//        if (result) {
//            return ZenResult.success("钉钉配置校验成功");
//        }
//        return ZenResult.fail("钉钉配置错误");
//
        conf.setDingCheck(false);
        ZenCache.set(AppConf.cacheKey, conf);
        return ZenResult.fail("钉钉配置错误");
    }

    private static void createMApp(AppConf conf) {

    }

    public static void Serialize(AppConf conf) {
        DingApp dingApp = new DingApp();
        dingApp.setCorpId(conf.getDingCorpId());
        dingApp.setAppId(conf.getDingAppId());
        dingApp.setAgentId(conf.getDingAgentId());
        dingApp.setName(conf.getDingAppName());

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
    private static boolean getAppInfo(AppConf conf) throws ApiException {
        String apiURL = "https://oapi.dingtalk.com/microapp/list";
        DefaultDingTalkClient client = new DefaultDingTalkClient(apiURL);
        OapiMicroappListRequest req = new OapiMicroappListRequest();
        String appName = conf.getDingAppName().toLowerCase();
        OapiMicroappListResponse response = client.execute(req, token);
        List<OapiMicroappListResponse.Applist> applists = response.getAppList();
        for (OapiMicroappListResponse.Applist app : applists) {
            if (app.getName().toLowerCase().equals(appName)) {
                String link = app.getHomepageLink();
                try {
                    link = URLDecoder.decode(link, "utf-8");
                    link = link.substring(link.lastIndexOf("?") + 1);
                    String[] params = link.split("&");
                    for (String param : params) {
                        if (param.contains("miniAppId")) {
                            conf.setDingAppId(param.substring(param.indexOf("=") + 1));
                            conf.setDingAgentId(app.getAgentId());
                            return true;
                        }
                    }
                } catch (UnsupportedEncodingException e) {
                    Zen.getLoggerEngine().exception(e);
                }
            }
        }

        return false;
    }
}
