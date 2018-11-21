package com.zeto.kooteam;

import com.zeto.Zen;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.service.EventBiz;


/**
 * Created by sinbo on 17-7-3.
 */

public class Application {
    public static void main(String[] args) {
        int listenPort = 7053;
        String appName = "kooteam";
        EventBiz.init();
        Zen.setLoginURL("/home.html");
        Zen.start(appName, listenPort, Application.class);
        DingClient.init();
    }
}
