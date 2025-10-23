package com.yimiyisu.kooteam.kit;

import com.google.gson.JsonObject;
import com.yimiyisu.kooteam.domain.SelfsDO;
import com.zen.kit.ConfigKit;
import com.zen.kit.JsonKit;

import java.util.HashMap;
import java.util.Map;

//获取登陆所需参数
public class LoginKit {
    public static Map<String, String> login() {
        JsonObject kooteam = ConfigKit.self("kooteam");

        SelfsDO selfsDO = JsonKit.parse(kooteam, SelfsDO.class);
        Map<String,String> login = new HashMap<>();
        selfsDO.getSelfs().forEach(self -> {
            String name = self.getName();
            String value = self.getValue();
            // 去除 JSON 字符串的多余引号
            if (value != null && value.startsWith("\"") && value.endsWith("\"")) {
                value = value.substring(1, value.length() - 1);
            }
            ConfigKit.self(name,value);
            login.put(name,value);
        });
        return login;
    }
}
