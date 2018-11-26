package com.zeto.kooteam.dingtalk;

import com.blade.ioc.annotation.Bean;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiGettokenRequest;
import com.dingtalk.api.response.OapiGettokenResponse;
import com.zeto.Zen;
import com.zeto.ZenCache;
import com.zeto.ZenEnvironment;
import com.zeto.kooteam.service.domain.DingApp;
import com.zeto.util.GsonUtil;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;

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
        String configPath = ZenEnvironment.getPath() + "/" + ZenEnvironment.getAppName() + ".json";// 文件配置路径
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
            }
        } catch (Exception e) {
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
}
