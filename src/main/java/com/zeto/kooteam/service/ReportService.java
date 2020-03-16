package com.zeto.kooteam.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.kit.GsonKit;
import com.google.common.base.Strings;
import com.zeto.ZenConditionKit;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.ZenUserKit;
import com.zeto.domain.ZenCondition;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;
import com.zeto.kooteam.service.domain.ReportDO;
import com.zeto.kooteam.service.eventbus.model.MailMode;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Map;

@Bean
public class ReportService {
    @Inject
    private ZenStorageEngine zenStorageEngine;
    private final static String tableName = "myReport";

    public void send(String _id, ZenUser user) {
        ZenResult content = zenStorageEngine.get(tableName, _id);
        if (content.isEmpty() || content.get("status").equals("1")) {
            return;
        }
        if (!user.getUid().equals(content.get("uid"))) {
            return;
        }
        MailMode mailMode = new MailMode();
        String mails = content.get("mails"), targetUid;
        if (mails != null) {
            mailMode.addTo(mails.split(","));
        }
        List<Map<String, Object>> readers = GsonKit.parseListMap(content.get("readers"));
        if (readers != null) {
            for (Map<String, Object> item : readers) {
                targetUid = item.get("uid").toString();
                ZenUser target = ZenUserKit.get(targetUid);
                if (target != null && target.getEmail() != null) {
                    mailMode.addTo(target.getEmail());
                }
                ZenData params = ZenData.create("reportId", _id).put("uid", targetUid);
                zenStorageEngine.execute("put/reportReader", params, null);
            }
        }
        ZenData params = ZenData.create("_id", _id).put("status", "1");
        zenStorageEngine.execute("patch/myReport", params, user);
        mailMode.setContent(content.get("content"));
        mailMode.setTitle(content.get("title"));
        EventBiz.sendMail(mailMode);
    }

    public ZenResult data(ZenUser user, String mode) {
        long start, end = DateKit.now() + 3600;
        int dateId;
        String title;
        Date now = new Date();
        Calendar calendar = Calendar.getInstance();
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        calendar.setTime(now);
        // 周报
        if (mode.equals("1")) {
            dateId = calendar.get(Calendar.WEEK_OF_MONTH);
            title = user.getNick() + "的周报  [" + DateKit.toString(now, "yyyy年MM") + "月第" + dateId + "周]";
            start = end - 7 * 24 * 3600;
        } else {
            start = end - 24 * 3600;
            dateId = calendar.get(Calendar.DAY_OF_YEAR);
            title = user.getNick() + "的日报  [" + DateKit.toString(now, "yyyy-MM-dd") + "]";
        }
        ZenCondition condition = ZenConditionKit.And().outputs("title", "status").
                eq("owner", user.getUid()).
                greater("updatetime", start).
                lesser("updatetime", end);

        ZenResult result = ZenResult.success().put("title", title).put("dateId", dateId),
                things = zenStorageEngine.select("thing", condition);
        if (things.isEmpty()) {
            return result;
        }
        String done = "", undone = "";
        for (Map<String, Object> item : things.getListWidthMap()) {
            if (item.get("status").equals(1L)) {
                done += "<li>" + item.get("title") + "</li>";
            } else {
                undone += "<li>" + item.get("title") + "</li>";
            }
        }
        if (done.equals("")) {
            done = "<li></li>";
        }
        if (undone.equals("")) {
            undone = "<li></li>";
        }
        String content = String.format("<h2>已完成工作</h2><ol class='k-done'>%s</ol><h2>未完成的工作</h2><ol class='k-undo'>%s</ol>", done, undone);
        return ZenResult.success().put("content", content).put("title", title);
    }

    public ReportDO config(String userId) {
        ZenUser user = new ZenUser();
        user.setUid(userId);
        ZenResult userConfig = zenStorageEngine.execute("get/userReport", new ZenData(), user);
        ReportDO reportDO;
        if (userConfig.isEmpty() || Strings.isNullOrEmpty(userConfig.get("report"))) {
            reportDO = new ReportDO();
        } else {
            reportDO = GsonKit.parse(userConfig.get("report"), ReportDO.class);
            if (reportDO == null) {
                reportDO = new ReportDO();
            }
        }
        return reportDO;
    }
}
