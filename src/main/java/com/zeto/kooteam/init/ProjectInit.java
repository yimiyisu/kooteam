package com.zeto.kooteam.init;

import com.zeto.*;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;


public class ProjectInit {
    private static final int maxtime = 1440;

    public static void execute(ZenUser user) {
        String cacheID = "userProject" + user.getUid();
        if (ZenCache.get(cacheID) != null) {
            return;
        }
        ZenStorageEngine zenStorageEngine = Zen.getStorageEngine();
        if (ZenEnvironment.isOnline()) {
            ZenCache.set(cacheID, "MgCondition", maxtime);
        }
        // 添加初期数据
        ZenData data = ZenData.put("title", "开始使用Kooteam");
        data.add("todo", "8");
        data.add("board", "{\"id\":8308,\"content\":[{\"title\":\"了解Kooteam\",\"tag\":\"t1\",\"sons\":[]}," +
                "{\"title\":\"快速开始\",\"tag\":\"t2\",\"sons\":[]}," +
                "{\"title\":\"更多帮助\",\"tag\":\"t3\",\"sons\":[]}]}");
        ZenResult result = zenStorageEngine.execute("put/project", data, user);

        // 同步关联用户
        ZenData param = ZenData.put("userId", user.getUid()).
                add("projectId", result.get("_id")).add("role", "5");
        zenStorageEngine.execute("put/projectUser", param, user);

        String _id = result.get("_id");
        ZenData example = ZenData.put("owner", user.getUid());
        example.add("quadrant", "b");
        example.add("projectId", _id);
        example.add("tag", "t1");
        example.add("title", "快速了解「文档」功能");
        example.add("content", "<p>文档，不仅仅只是文本。还支持在线绘制<b>流程图</b>和<b>思维导图</b>，从此告别庞大的第三方软件。</p>\n");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("title", "快速了解「项目」功能");
        example.set("content", "<p>如何对项目了如指掌？</p><p>Kooteam将帮助你实时掌握项目进度，给成员分配任务，管理项目文件，实现无缝协作。</p>\n");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("title", "快速了解「日程」功能");
        example.set("content", "以月视图、周视图，快速了解日程。帮助你告别杂乱无章，开始井然有序的工作状态，让你的工作效率倍增。");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("title", "快速了解「待办」功能");
        example.set("content", "将每天的计划分成轻重缓急，逐一解决。也可将随时迸发的灵感，记录在其中。");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("title", "从今天开始使用Kooteam");
        example.set("content", "从今天开始使用Kooteam，这条任务将同步到日程中，你可以设置日期，修改优先级，同步到日程计划中。");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("tag", "t2");
        example.add("quadrant", "c");
        example.set("title", "为任务添加成员和日期");
        example.set("content", "");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("title", "点击【+】创建第一个任务");
        example.set("content", "");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("tag", "t3");
        example.add("quadrant", "d");
        example.set("title", "如何添加好友");
        example.set("content", "<p>打开微信，扫描下方的二维码。</p><p>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;<img alt=\"Image\" src=\"https://b.yimiyisu.com/kooteam/friend.png\" width=\"300\" height=\"300\"><br></p>");
        zenStorageEngine.execute("put/thing", example, user);

    }
}
