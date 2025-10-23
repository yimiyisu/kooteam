package com.yimiyisu.kooteam.controller;

import java.util.List;

import com.yimiyisu.kooteam.domain.LogDO;
import com.yimiyisu.kooteam.events.department.model.DepartmentEventModel;
import com.yimiyisu.kooteam.service.AliLogGetService;
import com.zen.ZenController;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenMessage;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.Inject;
import com.zen.domain.AuthDO;
import com.zen.domain.MessageDO;
import com.zen.enums.ZenRole;
import com.zen.kit.CacheKit;
import com.zen.kit.ConfigKit;
import com.zen.kit.EventKit;
import com.zen.kit.JsonKit;
import com.zen.kit.MessageKit;
import com.zen.kit.StringKit;

@AccessRole(ZenRole.SUPPER)
public class System extends ZenController {

    private static final String APPS_KEY = "apps";
    @Inject
    private ZenEngine zenEngine;
    @Inject
    private AliLogGetService aliLogGetService;

    public ZenResult apps(ZenData data) {
        if (data.isEmpty()) {
            Object appsData = ConfigKit.self(System.APPS_KEY);
            return ZenResult.success().setData(appsData);
        }
        ConfigKit.self(System.APPS_KEY, data.toString());
        return ZenResult.success("保存成功");
    }

    public ZenResult log(ZenData data) {
        String functionName = data.get("app");
        String date = data.get("date");
        List<LogDO> logDOList = aliLogGetService.getLog(date, functionName, Integer.parseInt(data.get("page")), 20);
        return ZenResult.success().setData(logDOList);
    }

    public ZenResult rsyncDepartment() {
        String cacheKey = "departmentRsync";
        String status = CacheKit.get(cacheKey);
        if (status != null)
            return ZenResult.fail("正在同步中，请勿重复点击");
        // 10分钟内，只能同步一次
        CacheKit.set(cacheKey, "rsync", 10);
        EventKit.trigger(new DepartmentEventModel());
        return ZenResult.success("正在同步中，请稍后刷新页面");
    }

    public ZenResult checkMessage(ZenData data) {
        String templateName = data.get("name");
        ZenMessage zenMessage = new ZenMessage(templateName);
        zenMessage.setContent(data.get("content"));
        zenMessage.setFrom(data.getUid());
        zenMessage.setTitle(data.get("title"));
        zenMessage.setMobile(data.get("mobile"));
        String to = data.get("recipient");
        if (StringKit.isEmpty(to)) {
            to = data.getUid();
        }

        if (!data.isEmpty("link")) {
            zenMessage.setLink(data.get("link"));
        }

        String messageId = zenMessage.test(to);
        MessageDO messageDO = MessageKit.get(messageId);
        EventKit.trigger(messageDO);
        return ZenResult.success("消息已发送，请检查是否查收成功");
    }

    public ZenResult createOAuth(ZenData data) {
        String id = data.getId();
        String domain = data.get("domain");
        String accessKey = StringKit.SHA1(id);
        String secretKey = StringKit.encrypt(domain + ":" + id, id);
        data.put("accessKey", accessKey);
        data.put("secretKey", secretKey);
        return zenEngine.execute("put/oauth", data);
    }

    public ZenResult rsyncOAuth() {
        ZenResult oauths = zenEngine.execute("list/oauth", ZenData.create("pageSize", "100"));
        List<AuthDO> authDOList = oauths.asList(AuthDO.class);
        ConfigKit.self("oauth", "kooteam", JsonKit.stringify(authDOList));
        return ZenResult.success(null);
    }

}
