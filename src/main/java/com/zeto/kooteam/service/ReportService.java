package com.zeto.kooteam.service;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.blade.kit.GsonKit;
import com.google.common.base.Strings;
import com.zeto.ZenData;
import com.zeto.ZenResult;
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
        if (user != null) {// 手动发送，需要校验邮件身份
            if (!user.getUid().equals(content.get("uid"))) {
                return;
            }
        }
        addReaders(content.get("readers"), _id);
        ZenData params = ZenData.create("_id", _id).put("status", "1");
        zenStorageEngine.execute("patch/myReport", params, user);
        MailMode mailMode = new MailMode();
        mailMode.setData(content);
        EventBiz.sendMail(mailMode);
        // 发送邮件
    }

    public void send(String _id) {
        send(_id, null);
    }

    public ZenResult data(ZenUser user, String mode) {
        long start, end = DateKit.now();
        Calendar calendar = this.getCalendar();
        int dateId;
        String title;
        // 周报
        if (mode.equals("1")) {
            start = end - 7 * 24 * 3600;
            dateId = calendar.get(Calendar.WEEK_OF_YEAR);
            title = user.getNick() + "的周报，第" + dateId + "周";
        } else {
            start = end - 24 * 3600;
            dateId = calendar.get(Calendar.DAY_OF_YEAR);
            title = user.getNick() + "的日报";
        }
        ZenResult result = ZenResult.success().put("title", title).put("dateId", dateId);
        ZenData param = ZenData.create("end", end).put("start", start);
        List<Map<String, Object>> things = zenStorageEngine.execute("select/thingByStartAndUid", param, user).getListWidthMap();
        if (things == null || things.size() == 0) {
            return result;
        }
        String done = "", undone = "";
        for (Map<String, Object> item : things) {
            if (item.get("status").equals(1)) {
                undone += "<li>" + item.get("title") + "</li>";
            } else {
                done += "<li>" + item.get("title") + "</li>";
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


    private void addReaders(String readers, String id) {
        List<Map<String, Object>> current = GsonKit.parseListMap(readers);
        if (current == null) {
            return;
        }
        for (Map<String, Object> item : current) {
            ZenData params = ZenData.create("reportId", id).put("uid", item.get("_id"));
            zenStorageEngine.execute("put/reportReader", params, null);
        }
    }

    private Calendar getCalendar() {
        Calendar calendar = Calendar.getInstance();
        calendar.setFirstDayOfWeek(Calendar.MONDAY);
        calendar.setTime(new Date());
//        calendar.get(Calendar.DAY_OF_YEAR);
//        return calendar.get(Calendar.WEEK_OF_YEAR);
        return calendar;
    }
}
