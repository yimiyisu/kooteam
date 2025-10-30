package com.yimiyisu.kooteam.controller;

import com.yimiyisu.kooteam.domain.PermissionAppDO;
import com.yimiyisu.kooteam.domain.ThingDO;
import com.yimiyisu.kooteam.service.PermissionService;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.domain.ZenUser;
import com.zen.enums.UserBasicTag;
import com.zen.enums.ZenException;
import com.zen.enums.ZenRole;
import com.zen.kit.ConfigKit;
import com.zen.kit.DateKit;
import com.zen.kit.StringKit;
import com.zen.kit.UserKit;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@AccessRole(ZenRole.SIGNATURE)
public class User extends ZenController {
    private final int DAY = 24 * 60 * 60;
    private final String TEMPLATENAME = "mail";
    private String htmlTemplate = """
            <html>
            <head>
            <style>.k-doc{min-height:240px;border:1px solid;margin:0 20px;border-radius:4px;background-color:var(--a-fill-color-lighter);border-color:var(--a-border-color)}.mce-content-body{outline:none;cursor:text;position:relative;line-height:26px;font-size:14px;z-index:1;background:transparent;word-wrap:break-word}.mce-content-body.ml-2{margin:0 0 20px 20px}.mce-content-body a.selected{background:var(--a-color-primary-light-3)}.mce-content-body img{cursor:pointer;max-width:80%}.mce-content-body img.selected{box-shadow:0 0 0 4px var(--a-border-color)}.mce-content-body>:first-child{margin-top:0!important}.mce-content-body a{color:var(--a-color-primary);text-decoration:none;word-break:break-all}.mce-content-body a:visited{color:var(--a-color-primary-light-3)}.mce-content-body a:hover{color:var(--a-color-primary-light-3);outline:0}.mce-content-body a:active{outline:0;color:var(--a-color-primary-dark-2)}.mce-content-body h1,.mce-content-body h2,.mce-content-body h3,.mce-content-body h4,.mce-content-body h5,.mce-content-body h6{color:var(--a-text-color-primary)}.mce-content-body h1,.mce-content-body h2{padding-bottom:10px;border-bottom:1px solid var(--a-border-color-lighter)}.mce-content-body h1{font-size:24px;margin:30px 0 30px}.mce-content-body h2{font-size:20px;margin:14px 0 20px}.mce-content-body h3{font-size:18px;margin:12px 0 14px}.mce-content-body h4{font-size:16px;margin:10px 0 10px}.mce-content-body h5{font-size:14px;margin:0}.mce-content-body h6{font-size:12px}.mce-content-body p,.mce-content-body div{word-wrap:break-word;margin:0}.mce-content-body b,.mce-content-body strong{font-weight:bold}.mce-content-body i,.mce-content-body em{font-style:italic}.mce-content-body u{text-decoration:underline}.mce-content-body strike,.mce-content-body del{text-decoration:line-through}.mce-content-body ul,.mce-content-body ol{list-style:disc outside none;margin:15px 0;padding:0 0 0 30px}.mce-content-body ul li,.mce-content-body ol li{list-style-type:inherit}.mce-content-body ul ul,.mce-content-body ul ol,.mce-content-body ol ul,.mce-content-body ol ol{padding-left:30px}.mce-content-body ul ul,.mce-content-body ol ul{list-style:circle outside none}.mce-content-body ul ul ul,.mce-content-body ol ul ul{list-style:square outside none}.mce-content-body ol{list-style:decimal}.mce-content-body blockquote{border-left:6px solid var(--a-border-color);color:var(--a-text-color-secondary);padding-left:6px;margin:15px 0 15px 0}.mce-content-body blockquote>:first-child{margin-top:0}.mce-content-body code{display:inline-block;padding:0 4px;margin:0 5px;background:var(--a-fill-color-lighter);border-radius:3px;font-size:13px;font-family:"monaco","Consolas","Liberation Mono",Courier,monospace;word-break:break-all;word-wrap:break-word}.mce-content-body pre{padding:10px 5px 10px 10px;margin:15px 0;display:block;line-height:18px;border-radius:3px;font-size:13px;font-family:"monaco","Consolas","Liberation Mono",Courier,monospace;white-space:pre;color:var(--a-text-color-secondary);border-right:3px solid var(--a-border-color-lighter);word-wrap:normal;overflow-x:auto}.mce-content-body pre code{display:block;padding:0;margin:0;background:none;border-radius:0}.mce-content-body hr{display:block;height:0px;border:0;border-top:1px solid var(--a-border-color);margin:15px 0;padding:0}.mce-content-body table{width:100%;table-layout:fixed;border-collapse:collapse;border-spacing:0;margin:15px 0}.mce-content-body table thead{background-color:var(--a-fill-color-extra-light)}.mce-content-body table td,.mce-content-body table th{min-width:40px;height:30px;border:1px solid var(--a-border-color-lighter);vertical-align:top;padding:2px 4px;text-align:left;box-sizing:border-box}.mce-content-body table td.active,.mce-content-body table th.active{background-color:var(--a-fill-color-light)}.mce-content-body img{margin:0 5px;vertical-align:middle}</style>
            </head>
            <body><div class=".k-doc">{{content}}</div></body>
            </html>
            """;
    @Inject
    private PermissionService permissionService;
    @Inject
    private ZenEngine zenEngine;

    // 首页统计数据： uid 今日到期 逾期任务 已完成
    public ZenResult count(ZenData data) {
        String uid = data.getUid(); // uid
        Map<String, Object> count = new HashMap<>(); // 最终返回数据
        count.put("uid", uid);

        // 查询我的任务列表
        ZenResult myThingList = zenEngine.execute("list/thingByOwner", ZenData.create("owner", data.getUid()));
        if (myThingList.isEmpty()) ZenResult.success().setData(count);
        List<ThingDO> thingList = myThingList.asList(ThingDO.class);

        // 统计任务数
        Map<String, Object> countDetail = getCountDetail(thingList);
        count.putAll(countDetail);

        return ZenResult.success().setData(count);
    }

    public ZenResult current(ZenData data) {
        ZenUser user = data.getUser();
        user.setMeta(null);
        ZenResult result = ZenResult.success().setData(user);
        result.put("env", ConfigKit.get("env"));
        result.put("app", ConfigKit.getApp());
        String appName = data.get("name");
        if (StringKit.isNotEmpty(appName)) {
            PermissionAppDO app = permissionService.get(data.getUid(), appName);
            result.put("menus", app.getPages());
            result.put("points", app.getPoints());
        }
        return result;
    }

    public ZenResult menusByApp(ZenData data) {
        PermissionAppDO app = permissionService.get(data.getUid(), data.get("name"));
        return ZenResult.success().setData(app);
    }

    public ZenResult tenantRole(ZenData data) {
        ZenUser user = data.getUser();
        if (!user.hasTag(UserBasicTag.TENANT_ADMIN)) return ZenException.NO_PERMISSION.asResult();
        return zenEngine.execute("select/roleByTenant", data);
    }

    public ZenResult rolePoint(ZenData data) {
        ZenUser user = data.getUser();
        if (!user.hasTag(UserBasicTag.TENANT_ADMIN)) return ZenException.NO_PERMISSION.asResult();
        String api = data.isEmpty("id") ? "put/role_app" : "patch/role_app";
        return zenEngine.execute(api, data);
    }

    public ZenResult refresh(ZenData data) {
        permissionService.remove(data.get("uid"), data.get("app"));
        return ZenResult.success("刷新成功");
    }

    public ZenResult deleteRoleUser(ZenData data) {
        ZenUser user = data.getUser();
        if (!user.hasTag(UserBasicTag.TENANT_ADMIN)) return ZenException.NO_PERMISSION.asResult();
        return zenEngine.execute("delete/role_userByTenant", data);
    }

    public ZenResult addRoleUser(ZenData data) {
        ZenUser user = data.getUser();
        if (!user.hasTag(UserBasicTag.TENANT_ADMIN)) return ZenException.NO_PERMISSION.asResult();
        return zenEngine.execute("put/role_user", data);
    }

    // 体验环境扫码登录
    public ZenResult trialLogin(ZenData data) throws UnsupportedEncodingException {
        if(StringKit.isNotEmpty(ConfigKit.get("trialUid"))){
            UserKit.createToken(ConfigKit.get("trialUid"), StringKit.decrypt(data.get("loginCode")).getValue());
            return ZenResult.success().setData("success");
        }
        return ZenResult.success();
    }

    public Map<String, Object> getCountDetail(List<ThingDO> thingList) {
        Map<String, Object> count = new HashMap<>();

        int today = 0;
        int expired = 0;
        int completed = 0;

        for (ThingDO thing : thingList) {
            long now = DateKit.now(); // 当前时间
            long end = thing.getEnd(); // 截止时间
            if (thing.getStatus() == 6) { // 已完成
                completed += 1;
                continue;
            }
            if (end != 0 && now >= end) { // 已逾期
                expired += 1;
                continue;
            }
            if (end != 0 && end - now < DAY) {
                today += 1;
            }
        }

        count.put("today", today);
        count.put("expired", expired);
        count.put("completed", completed);
        return count;
    }
}
