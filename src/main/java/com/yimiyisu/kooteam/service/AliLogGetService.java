package com.yimiyisu.kooteam.service;

import com.aliyun.openservices.log.Client;
import com.aliyun.openservices.log.common.LogContent;
import com.aliyun.openservices.log.common.QueriedLog;
import com.aliyun.openservices.log.exception.LogException;
import com.aliyun.openservices.log.request.GetLogsRequest;
import com.aliyun.openservices.log.response.GetLogsResponse;
import com.yimiyisu.kooteam.domain.LogDO;
import com.zen.annotation.Component;
import com.zen.kit.ConfigKit;
import com.zen.kit.DateKit;
import com.zen.kit.StringKit;

import java.util.ArrayList;
import java.util.List;

@Component
public class AliLogGetService {
    private static final long days = 15 * 24 * 3600;
    private static final int one_hour = 1800;
    private Client client;
    private String project;
    private String logStore;

    public List<LogDO> getLog(String date, String functionName, int page, int limit) {
        List<LogDO> logDOList = new ArrayList<>();
        if (client == null) {
            project = ConfigKit.get("logProject");
            logStore = ConfigKit.get("logStore");
            if (project == null || logStore == null) {
                return logDOList;
            }
            // 创建阿里云日志服务客户端
            client = new Client(ConfigKit.get("logPoint"), ConfigKit.get("logId"), ConfigKit.get("logSecret"));
        }
        try {
            long toTime;
            long fromTime;
            // 指定时间点的前后一个小时
            if (StringKit.isNotEmpty(date)) {
                toTime = Long.parseLong(date) + one_hour;
                fromTime = toTime - 2 * one_hour;
            } else {
                toTime = DateKit.now();
                fromTime = toTime - days;
            }
            // 构建查询请求
            GetLogsRequest request = new GetLogsRequest(
                    project, logStore, (int) fromTime, (int) toTime, "", buildQuery(functionName)
            );

            // 设置分页参数
            request.SetOffset((long) (page - 1) * limit);
            request.SetLine(limit);

            // 设置按时间倒序排列
            request.SetReverse(true);

            // 执行查询
            GetLogsResponse response = client.GetLogs(request);

            // 处理查询结果
            for (QueriedLog log : response.getLogs()) {
                LogDO logDO = convertToLogDO(log);
                logDOList.add(logDO);
            }

        } catch (LogException e) {
            throw new RuntimeException("阿里云日志查询失败", e);
        }

        return logDOList;
    }

    private String buildQuery(String functionName) {
        List<String> conditions = new ArrayList<>();

        // message不为空且不包含FC
        conditions.add("message:*");
        conditions.add("NOT message: FC*");

        // 函数名过滤
        if (functionName != null && !functionName.trim().isEmpty()) {
            conditions.add("functionName:" + functionName.trim());
        }

        return String.join(" AND ", conditions);
    }

    private LogDO convertToLogDO(QueriedLog log) {
        LogDO logDO = new LogDO();

        // 解析日志内容
        for (LogContent content : log.GetLogItem().GetLogContents()) {
            String key = content.GetKey();
            String value = content.GetValue();
            if (key.equals("message")) {
                logDO.setMessage(value);
            }
            int time = log.GetLogItem().GetTime();
            logDO.setFormatTime(DateKit.toString(time));
        }
        return logDO;
    }
}
