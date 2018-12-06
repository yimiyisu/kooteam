package com.zeto.kooteam.controller;

import com.google.common.io.Files;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenRole;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.domain.AppConf;
import com.zeto.kooteam.service.install.DBValidate;
import com.zeto.kooteam.service.install.DingTalkValidate;

import java.io.*;
import java.util.Properties;

@AccessRole(ZenRole.NORMAL)
public class Install {

    public ZenResult check(ZenData data) {
        if (!ZenEnvironment.isLocalApp()) {// 私有化部署
            return ZenResult.jump("/home.html");
        }
        if (DingClient.isDD()) {// 初始化已完成
            if (data.contains("status")) {
                return ZenResult.success();
            }
            return ZenResult.jump("/install.html?status=finish");
        }
        return ZenResult.success();
    }

    public ZenResult checkDB(ZenData data) {
        return DBValidate.check(data);
    }

    public ZenResult checkDing(ZenData data) {
        return DingTalkValidate.check(data);
    }

    public ZenResult checkWX(ZenData data) {
        return ZenResult.success();
    }

    public ZenResult save(ZenData data) {
        AppConf conf = ZenCache.get(AppConf.cacheKey, AppConf.class);
        if (conf == null) {
            return ZenResult.fail("保存失败，配置信息校验失败。");
        }
        if (!conf.isDbCheck()) {
            return ZenResult.fail("保存失败，数据库配置错误。");
        }

        if (conf.isDingCheck()) {
            //保存配置，执行钉钉通讯录同步任务，拉取应用信息
            DingTalkValidate.Serialize(conf);
            DingClient.init();
            serialize(conf);
            return ZenResult.success("配置成功").refresh();
        }
        if (conf.isWxCheck()) {
            serialize(conf);
            // 保存配置
            return ZenResult.success("配置成功").refresh();
        }
        return ZenResult.fail("保存失败，钉钉配置信息错误");
    }

    private void serialize(AppConf conf) {
        String profilepath = ZenEnvironment.getPath() + "/app.properties";
        try {
            File propFile = new File(profilepath);
            if (!propFile.exists()) {
                Files.touch(propFile);
            }
            Properties props = new Properties();
            props.load(new FileInputStream(profilepath));

            props.setProperty("mongoHost", conf.getMongoHost());
            props.setProperty("mongoDB", conf.getMongoDB());
            props.setProperty("mongoUser", conf.getMongoUser());
            props.setProperty("mongoPassword", conf.getMongoPassword());
            props.setProperty("mongoPort", conf.getMongoPort());

            props.setProperty("dingCorpId", conf.getDingCorpId());
            props.setProperty("dingSecret", conf.getDingSecret());
            props.setProperty("env", "online");

            OutputStream fos = new FileOutputStream(profilepath);
            props.store(fos, "auto created");
            fos.close();
            // 重新加载服务
            Zen.reload();
            EventBiz.employeeSync();// 同步企业账户
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
