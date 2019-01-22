package com.zeto.kooteam.controller;

import com.blade.kit.EncryptKit;
import com.google.common.base.Strings;
import com.google.common.io.Files;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenRole;
import com.zeto.kooteam.service.domain.AppConf;
import com.zeto.kooteam.service.install.DBValidate;

import java.io.*;
import java.util.Properties;

@AccessRole(ZenRole.NORMAL)
public class Install {


    public ZenResult check(ZenData data) {
        String status = data.get("status");
        if (Strings.isNullOrEmpty(status) && !ZenEnvironment.isNoSetup()) {// 私有化部署
            return ZenResult.jump("/install.html?status=finish");
        }
        return ZenResult.success();
    }

    public ZenResult checkDB(ZenData data) {
        return DBValidate.check(data);
    }

    public ZenResult save(ZenData data) {
        String pwd = data.get("pwd");
        if (Strings.isNullOrEmpty(pwd)) {
            return ZenResult.fail("管理员不能为空");
        }
        AppConf conf = ZenCache.get(AppConf.cacheKey, AppConf.class);
        if (conf == null) {
            return ZenResult.fail("保存失败，配置信息校验失败。");
        }
        if (!conf.isDbCheck()) {
            return ZenResult.fail("保存失败，数据库配置错误。");
        }
        serialize(conf);
        Zen.reload();
        pwd = EncryptKit.md5(pwd);
        ZenCache.set("rootInit", pwd);
        if (!conf.isMysql()) {
            ZenUserHelper.resetRoot();
        }
        return ZenResult.jump("/install.html?status=finish");
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
            props.setProperty("env", "online");

            if (conf.isMysql()) {
                props.setProperty("mode", "3");
                props.setProperty("dbHost", "jdbc:mysql://" + conf.getHost() + ":" + conf.getPort() + "/" + conf.getDatabase());
                props.setProperty("dbUser", conf.getUser());
                props.setProperty("dbPasswd", conf.getPassword());
            } else {
                props.setProperty("mode", "4");
                props.setProperty("mongoHost", conf.getHost());
                props.setProperty("mongoDB", conf.getDatabase());
                props.setProperty("mongoUser", conf.getUser());
                props.setProperty("mongoPassword", conf.getPassword());
                props.setProperty("mongoPort", conf.getPort());
            }

            OutputStream fos = new FileOutputStream(profilepath);
            props.store(fos, "Kooteam Created");
            fos.close();
            // 重新加载服务
//            Zen.reload();
//            EventBiz.employeeSync();// 同步企业账户
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
