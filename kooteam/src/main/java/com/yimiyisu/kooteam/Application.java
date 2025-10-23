package com.yimiyisu.kooteam;

import com.zen.ZenApp;

/**
 * Created by sinbo on 17-7-3.
 */


public class Application extends ZenApp {

    public static void main(String[] args) {
        // 应用端口
        int listenPort = 7053;
        String appName = "kooteam";
        ZenApp app = new Application();
        app.start(args, appName, listenPort);
    }
}
