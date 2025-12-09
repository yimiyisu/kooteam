package com.yimiyisu.kooteam.kit;

import com.yimiyisu.kooteam.domain.MonitorInfoDO;
import com.yimiyisu.kooteam.domain.ThreadInfoDo;
import com.zen.kit.ConfigKit;

import java.lang.management.*;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

/**
 * @author Z-熙玉
 * @version 1.0
 * 查询基本指标以及线程列表
 */
public class PerformanceKit {

    private static final long GB = 1024 * 1024 * 1024;
    private static final long MB = 1024 * 1024;
    private static final DecimalFormat decimalFormat = new DecimalFormat("0.0");

    // 查询基本信息
    public static MonitorInfoDO getBasicInfo() {
        MonitorInfoDO monitorInfoModel = new MonitorInfoDO();

        MemoryMXBean memoryMXBean = ManagementFactory.getMemoryMXBean();
        MemoryUsage heapMemoryUsage = memoryMXBean.getHeapMemoryUsage();
        MemoryUsage nonHeapMemoryUsage = memoryMXBean.getNonHeapMemoryUsage();

        long usedHeapMemory = heapMemoryUsage.getUsed();
        long maxHeapMemory = heapMemoryUsage.getMax();
        long usedNonHeapMemory = nonHeapMemoryUsage.getUsed();
        long maxNonHeapMemory = nonHeapMemoryUsage.getMax();

        String usedHeapMemoryInfo = PerformanceKit.decimalFormat.format(1.0 * usedHeapMemory / PerformanceKit.MB) + "MB";
        String maxHeapMemoryInfo = PerformanceKit.decimalFormat.format(1.0 * maxHeapMemory / PerformanceKit.MB) + "MB";
        String usedNonHeapMemoryInfo = PerformanceKit.decimalFormat.format(1.0 * usedNonHeapMemory / PerformanceKit.MB) + "MB";

        String maxNonHeapMemoryInfo;
        if (maxNonHeapMemory == -1L) maxNonHeapMemoryInfo = "-";
        else
            maxNonHeapMemoryInfo = PerformanceKit.decimalFormat.format(1.0 * maxNonHeapMemory / PerformanceKit.MB) + "MB";

        monitorInfoModel.setUsedHeapMemoryInfo(usedHeapMemoryInfo);
        monitorInfoModel.setMaxHeapMemoryInfo(maxHeapMemoryInfo);
        monitorInfoModel.setUsedNonHeapMemoryInfo(usedNonHeapMemoryInfo);
        monitorInfoModel.setMaxNonHeapMemoryInfo(maxNonHeapMemoryInfo);

        OperatingSystemMXBean operatingSystemMXBean = ManagementFactory.getOperatingSystemMXBean();
        if (operatingSystemMXBean instanceof com.sun.management.OperatingSystemMXBean) {
            com.sun.management.OperatingSystemMXBean opBean = (com.sun.management.OperatingSystemMXBean) operatingSystemMXBean;
            double cpuLoad = opBean.getCpuLoad();
            String cpuLoadInfo = PerformanceKit.decimalFormat.format(cpuLoad * 100) + "%";
            monitorInfoModel.setCpuLoadInfo(cpuLoadInfo);

            double processCpuLoad = opBean.getProcessCpuLoad();
            String processCpuLoadInfo = PerformanceKit.decimalFormat.format(processCpuLoad * 100) + "%";
            monitorInfoModel.setProcessCpuLoadInfo(processCpuLoadInfo);

            long totalMemorySize = opBean.getTotalMemorySize();
            long freeMemorySize = opBean.getFreeMemorySize();

            String totalMemoryInfo = PerformanceKit.decimalFormat.format(1.0 * totalMemorySize / PerformanceKit.GB) + "GB";
            String freeMemoryInfo = PerformanceKit.decimalFormat.format(1.0 * freeMemorySize / PerformanceKit.GB) + "GB";
            String useMemoryInfo = PerformanceKit.decimalFormat.format(1.0 * (totalMemorySize - freeMemorySize) / PerformanceKit.GB) + "GB";
            String memoryUseRatioInfo = PerformanceKit.decimalFormat.format((1.0 * (totalMemorySize - freeMemorySize) / totalMemorySize * 100)) + "%";
            monitorInfoModel.setTotalMemoryInfo(totalMemoryInfo);
            monitorInfoModel.setFreeMemoryInfo(freeMemoryInfo);
            monitorInfoModel.setUseMemoryInfo(useMemoryInfo);
            monitorInfoModel.setMemoryUseRatioInfo(memoryUseRatioInfo);

            long freeSwapSpaceSize = opBean.getFreeSwapSpaceSize();
            long totalSwapSpaceSize = opBean.getTotalSwapSpaceSize();

            String freeSwapSpaceInfo = PerformanceKit.decimalFormat.format(1.0 * freeSwapSpaceSize / PerformanceKit.GB) + "GB";
            String totalSwapSpaceInfo = PerformanceKit.decimalFormat.format(1.0 * totalSwapSpaceSize / PerformanceKit.GB) + "GB";
            String useSwapSpaceInfo = PerformanceKit.decimalFormat.format(1.0 * (totalSwapSpaceSize - freeSwapSpaceSize) / PerformanceKit.GB) + "GB";
            String swapUseRatioInfo = PerformanceKit.decimalFormat.format((1.0 * (totalSwapSpaceSize - freeSwapSpaceSize) / totalSwapSpaceSize * 100)) + "%";
            monitorInfoModel.setFreeSwapSpaceInfo(freeSwapSpaceInfo);
            monitorInfoModel.setTotalSwapSpaceInfo(totalSwapSpaceInfo);
            monitorInfoModel.setUseSwapSpaceInfo(useSwapSpaceInfo);
            monitorInfoModel.setSwapUseRatioInfo(swapUseRatioInfo);

            String arch = opBean.getArch();
            String name = opBean.getName();
            monitorInfoModel.setArch(arch);
            monitorInfoModel.setName(name);
            monitorInfoModel.setAppName(ConfigKit.appName());
        }
        return monitorInfoModel;
    }

    // 查询线程列表
    public static List<ThreadInfoDo> getThreadList() {
        ThreadMXBean threadMXBean = ManagementFactory.getThreadMXBean();
        long[] threadIds = threadMXBean.getAllThreadIds();
        ThreadInfo[] threadInfos = threadMXBean.getThreadInfo(threadIds);

        List<ThreadInfoDo> threadInfoDoList = new ArrayList<ThreadInfoDo>(threadIds.length);
        for (ThreadInfo threadInfo : threadInfos) {
            ThreadInfoDo threadInfoDo = new ThreadInfoDo();
            threadInfoDo.setThreadId(threadInfo.getThreadId()); // 线程id
            threadInfoDo.setThreadName(threadInfo.getThreadName()); // 线程名称
            threadInfoDo.setThreadState(threadInfo.getThreadState()); // 线程状态
            threadInfoDo.setCpuTime((float) threadMXBean.getThreadCpuTime(threadInfo.getThreadId()) / 1000000); // 单位：豪秒
            threadInfoDoList.add(threadInfoDo);
        }
        return threadInfoDoList;
    }

    // 终止线程
    public static String terminateThread(long threadId) {
        Set<Thread> activeThreads = Thread.getAllStackTraces().keySet();
        for (Thread thread : activeThreads)
            if (thread.getId() == threadId) {
                thread.interrupt();
                if (thread.isInterrupted()) return "线程已中断";
                else return "线程未成功响应中断";
            }
        return "线程不存在或已终止";
    }
}
