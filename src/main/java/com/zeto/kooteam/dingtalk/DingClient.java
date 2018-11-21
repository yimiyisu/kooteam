package com.zeto.kooteam.dingtalk;

import com.blade.ioc.annotation.Bean;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiGettokenRequest;
import com.dingtalk.api.request.OapiMicroappListRequest;
import com.dingtalk.api.response.OapiGettokenResponse;
import com.dingtalk.api.response.OapiMicroappListResponse;
import com.taobao.api.ApiException;
import com.zeto.Zen;
import com.zeto.ZenCache;
import com.zeto.ZenEnvironment;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.domain.DingApp;
import com.zeto.util.GsonUtil;

import java.io.*;
import java.net.URLDecoder;
import java.util.List;

@Bean
public class DingClient {
    // e app key
    //    private static final String appKey = "ding6yjcb4fqccevjq7x";
    //    private static final String appSecret = "AjT9_dq0JYLu7bTB01b9JEfRbNQnDLq7pJOLUf4ZhKjxgOXwGzDcdvVob40wS9yn";

    private static DingApp dingApp = null;
    private static final String apiURL = "https://oapi.dingtalk.com/gettoken";
    private static final String tokenCacheId = "dingTokenCache";

    public static boolean isDD() {
        return dingApp != null;
    }

    public static void init() {
        if (dingApp != null) {
            return;
        }
        String configPath = ZenEnvironment.getPath() + "/" + ZenEnvironment.getAppName() + ".conf";// 文件配置路径
        try {
            File configFile = new File(configPath);
            if (configFile.exists()) {
                InputStreamReader reader = new InputStreamReader(
                        new FileInputStream(configFile)); // 建立一个输入流对象reader
                BufferedReader br = new BufferedReader(reader); // 建立一个对象，它把文件内容转成计算机能读懂的语言
                String line, result = "";
                while ((line = br.readLine()) != null) {
                    result += line;
                }
                // 从配置文件中读取
                dingApp = GsonUtil.parse(result, DingApp.class);
                return;
            }
        } catch (Exception e) {
            Zen.getLoggerEngine().exception(e);
        }
        // 初始化失败，则不生成配置文件
        if (!initAppInfo()) {
            return;
        }
        // 第一次写配置文件，需要自动同步会员信息
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

    // 创建配置文件，独立部署时，需要调用该方法
    public static void createConfig(String cropId, String secret) {

    }

    public static DingApp info() {
        if (dingApp == null) {
            init();
        }
        return dingApp;
    }

    public static String getToken() {
        String token = ZenCache.get(tokenCacheId);
        if (token != null) {
            return token;
        }
        DefaultDingTalkClient client = new DefaultDingTalkClient(apiURL);
        OapiGettokenRequest request = new OapiGettokenRequest();
//        request.setAppkey(dingApp.getCorpId());
//        request.setAppsecret(dingApp.getSecret());
        request.setAppkey(ZenEnvironment.get("dingCorpId"));
        request.setAppsecret(ZenEnvironment.get("dingSecret"));
        request.setHttpMethod("GET");
        try {
            OapiGettokenResponse response = client.execute(request);
            token = response.getAccessToken();
            ZenCache.set(tokenCacheId, token, 110);// 缓存110分钟
            return token;
        } catch (Exception ex) {
            Zen.getLoggerEngine().exception(ex);
        }
        return null;
    }

    private static boolean initAppInfo() {
        dingApp = new DingApp();
        dingApp.setCorpId(ZenEnvironment.get("dingCorpId"));
        DefaultDingTalkClient client = new DefaultDingTalkClient("https://oapi.dingtalk.com/microapp/list");
        OapiMicroappListRequest req = new OapiMicroappListRequest();
        try {
            OapiMicroappListResponse response = client.execute(req, DingClient.getToken());
            List<OapiMicroappListResponse.Applist> applists = response.getAppList();
            for (OapiMicroappListResponse.Applist app : applists) {
                if (app.getName().equals(dingApp.getName())) {
                    String link = app.getHomepageLink();
                    try {
                        link = URLDecoder.decode(link, "utf-8");
                        link = link.substring(link.lastIndexOf("?") + 1);
                        String[] params = link.split("&");
                        for (String param : params) {
                            if (param.contains("miniAppId")) {
                                dingApp.setAppId(param.substring(param.indexOf("=") + 1));
                                dingApp.setAgentId(app.getAgentId());
                                return true;
                            }
                        }
                    } catch (UnsupportedEncodingException e) {
                        Zen.getLoggerEngine().exception(e);
                    }
                }
            }
        } catch (ApiException e) {
            Zen.getLoggerEngine().exception(e);
        }
        return false;
    }
}
