package com.zeto.kooteam.dingtalk;

import com.blade.ioc.annotation.Bean;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiGettokenRequest;
import com.dingtalk.api.response.OapiGettokenResponse;
import com.google.common.base.Strings;
import com.zeto.Zen;
import com.zeto.ZenCache;
import com.zeto.ZenEnvironment;
import com.zeto.kooteam.service.domain.DingApp;
import com.zeto.util.GsonUtil;

import java.io.*;
import java.util.Properties;

@Bean
public class DingClient {
    // e app key
    //    private static final String appKey = "ding6yjcb4fqccevjq7x";
    //    private static final String appSecret = "AjT9_dq0JYLu7bTB01b9JEfRbNQnDLq7pJOLUf4ZhKjxgOXwGzDcdvVob40wS9yn";

    private static DingApp dingApp = null;
    private static final String apiURL = "https://oapi.dingtalk.com/gettoken";
    private static final String tokenCacheId = "dingTokenCache";

    public static boolean isInited() {
        return dingApp != null;
    }

    public static void init() {
        if (dingApp != null) {
            return;
        }
        if (ZenEnvironment.isNoSetup() && !isMerge()) {
            return;
        }
        String dingDomain = ZenEnvironment.get("dingDomain");
        String dingAgentId = ZenEnvironment.get("dingAgentId");
        if (Strings.isNullOrEmpty(dingAgentId) || Strings.isNullOrEmpty(dingDomain)) {
            return;
        }
        dingApp = new DingApp();
        dingApp.setHost(dingDomain);
        dingApp.setCorpId(ZenEnvironment.get("dingCorpId"));
        dingApp.setSecret(ZenEnvironment.get("dingSecret"));
        dingApp.setAgentId(Long.valueOf(dingAgentId));
    }

    // 自动将kooteam.json迁移到app.properties中
    private static boolean isMerge() {
        String configPath = ZenEnvironment.getPath() + "/" + ZenEnvironment.getAppName() + ".json";// 文件配置路径
        try {
            File configFile = new File(configPath);
            if (!configFile.exists()) {
                return false;
            }
            InputStreamReader reader = new InputStreamReader(
                    new FileInputStream(configFile)); // 建立一个输入流对象reader
            BufferedReader br = new BufferedReader(reader); // 建立一个对象，它把文件内容转成计算机能读懂的语言
            String line, result = "";
            while ((line = br.readLine()) != null) {
                result += line;
            }
            // 从配置文件中读取，恢复到app.properties中
            dingApp = GsonUtil.parse(result, DingApp.class);
            configFile.delete();

            String profilepath = ZenEnvironment.getPath() + "/app.properties";
            try {
                File propFile = new File(profilepath);
                if (!propFile.exists()) {
                    return false;
                }
                Properties props = new Properties();
                props.load(new FileInputStream(profilepath));
                props.setProperty("mode", "4");
                props.setProperty("dingDomain", dingApp.getHost());
                props.setProperty("dingAgentId", dingApp.getAgentId().toString());
                props.setProperty("dingCorpId", dingApp.getCorpId());
                OutputStream fos = new FileOutputStream(profilepath);
                props.store(fos, "Kooteam Updated");
                fos.close();
            } catch (Exception e) {
                e.printStackTrace();
            }

            // 重新初始化上下文
            Zen.reload();
            init();
        } catch (Exception e) {
            Zen.getLoggerEngine().exception(e);
        }
        return true;
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
        request.setAppkey(dingApp.getCorpId());
        request.setAppsecret(dingApp.getSecret());
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
