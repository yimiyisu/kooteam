package com.zeto.kooteam.controller;

import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.kit.GsonKit;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.ZenUserKit;
import com.zeto.annotation.AccessRole;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.ReportService;
import com.zeto.kooteam.service.domain.ReportDO;

import java.util.Date;

@AccessRole
public class Report {
    @Inject
    private ReportService reportService;
    @Inject
    private ZenStorageEngine zenStorageEngine;

    private static final String DailyType = "0";
    private static final String tableName = "myReport";


    public ZenResult recieve(ZenUser user, ZenData data) {
        String[] recieves = zenStorageEngine
                .execute("select/reportReader", data, user)
                .getIds("reportId");
        if (recieves == null || recieves.length == 0) {
            return ZenResult.success().setTotal(0);
        }
        ZenResult reports = zenStorageEngine.selectByIds(tableName, recieves);
        reports = ZenUserKit.selectByUids(reports, "uid");
        long total = zenStorageEngine.count("reportReader", ZenConditionKit.And().eq("uid", user.getUid()));
        return ZenResult.success().setList(reports.getList()).setTotal(total);
    }

    // 详情
    public ZenResult detail(ZenUser user, ZenData data) {
        ZenResult report = zenStorageEngine.execute("get/myReport", data, user);
        if (report.isEmpty()) {
            return ZenResult.fail();
        }
        String uid = user.getUid();
        if (uid.equals(report.get("uid")) || report.get("readers").contains(uid)) {
            return report;
        }
        return ZenResult.fail();
    }

    // 模版
    public ZenResult template(ZenUser user, ZenData data) {
        String mode = data.get("mode");
        ZenResult result = reportService.data(user, data.get("mode"));
        ReportDO config = reportService.config(user.getUid());
        if (DailyType.equals(mode)) {
            result.put("mails", config.getDailyMail());
            result.put("readers", config.getDailyTo());
        } else {
            result.put("mails", config.getWeekMail());
            result.put("readers", config.getWeekTo());
        }
        return result;
    }


    //
    public ZenResult config(ZenData data, ZenUser user) {
        ReportDO reportDO = reportService.config(user.getUid());
        return ZenResult.success().setData(reportDO);
    }

    public ZenResult set(ZenData data, ZenUser user) {
        ZenData params = ZenData.create("report", data.get("report"));
        zenStorageEngine.execute("patch/userReport", params, user);
        return ZenResult.success("更新完成");
    }

    public ZenResult save(ZenData data, ZenUser user) {
        ZenResult result;
        String mails = data.get("mails"), readers = data.get("readers");
        if (data.isEmptyPrimary()) {
            String dateId = DateKit.toString(new Date(), "yyyy-MM-dd");
            long count = zenStorageEngine.count(tableName, ZenConditionKit.And()
                    .eq("uid", user.getUid()).eq("dateId", dateId));
            if (count > 0) {
                return ZenResult.fail(dateId + "汇报已经写，不要重复提交！");
            }
            data.put("dateId", dateId);
            data.put("status", "0");


            // 同步到用户的mail信息
            result = zenStorageEngine.execute("put/myReport", data, user);
        } else {
            result = zenStorageEngine.execute("patch/myReport", data, user);
        }
        if (!result.isSuccess()) {
            return result;
        }
        // 同步模版信息
        ReportDO config = reportService.config(user.getUid());
        String type = data.get("type");
        if (DailyType.equals(type)) {
            config.setDailyMail(mails);
            config.setDailyTo(readers);
        } else {
            config.setWeekMail(mails);
            config.setWeekTo(readers);
        }
        ZenData params = ZenData.create("report", GsonKit.stringify(config));
        zenStorageEngine.execute("patch/userReport", params, user);
        return result.setMessage("保存成功");
    }

    public ZenResult send(ZenData data, ZenUser user) {
        reportService.send(data.get("_id"), user);
        return ZenResult.success("发送完成");
    }

    public ZenResult saveWithSend(ZenData data, ZenUser user) {
        ZenResult result = this.save(data, user);
        reportService.send(result.get("_id"), user);
        return ZenResult.success("发送完成");
    }
}
