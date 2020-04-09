package com.zeto.kooteam.controller;

import com.blade.kit.EncryptKit;
import com.google.common.base.Strings;
import com.google.common.io.Files;
import com.zeto.*;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenAction;
import com.zeto.domain.ZenRole;
import com.zeto.kooteam.service.domain.AppConf;
import com.zeto.kooteam.service.install.DBValidate;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@AccessRole(ZenRole.ANONYMITY)
public class Install {


    public ZenResult check(ZenData data) {
        String status = data.get("status");
        if (Strings.isNullOrEmpty(status) && !ZenEnvironment.isNoSetup()) {// 私有化部署
            return ZenResult.redirect("/install.html?status=finish");
        }
        return ZenResult.success();
    }

    public ZenResult checkDB(ZenData data) {
        return DBValidate.check(data).setAction(ZenAction.SILENT);
    }

    public ZenResult save(ZenData data) {
        if (!ZenEnvironment.isNoSetup()) {
            return ZenResult.fail("已经配置过，不能重复配置");
        }
        String pwd = data.get("pwd");
        if (Strings.isNullOrEmpty(pwd)) {
            return ZenResult.fail("管理员密码不能为空");
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
            ZenUserKit.resetRoot();
        }
        return ZenResult.redirect("/install.html?status=finish");
    }

    private void serialize(AppConf conf) {
        String profilepath = ZenEnvironment.getPath() + "/app.properties";
        try {
            File propFile = new File(profilepath);
            if (!propFile.exists()) {
                Files.touch(propFile);
            }
            Map<String, String> params = new HashMap<>();
            params.put("mode", "3");
            params.put("dbHost", "jdbc:mysql://" + conf.getHost() + ":" + conf.getPort() + "/" + conf.getDatabase() + "?serverTimezone=UTC&characterEncoding=utf-8");
            params.put("dbUser", conf.getUser());
            params.put("dbPasswd", conf.getPassword());
            ZenEnvironment.serialize(params);
            // 重新加载服务
//            Zen.reload();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}
