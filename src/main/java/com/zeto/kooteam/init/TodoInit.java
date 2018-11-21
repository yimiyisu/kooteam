package com.zeto.kooteam.init;

import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.kit.DateKit;
import com.zeto.ZenCache;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.domain.ZenUser;
import com.zeto.driver.ZenStorageEngine;

@Bean
public class TodoInit {

    private static final int maxtime = 1440;

    @Inject
    private ZenStorageEngine zenStorageEngine;

    public void execute(ZenUser user) {
        String cacheID = "userTodo" + user.getUid();
        if (ZenCache.get(cacheID) != null) {
//            return;
        }
        if (ZenEnvironment.isOnline()) {
            ZenCache.set(cacheID, "init", maxtime);
        }
        // 添加初期数据
        int now = DateKit.now();
        ZenData example = ZenData.put("quadrant", "a");
        example.add("owner", user.getUid());
        example.add("start", String.valueOf(now));
        example.add("title", "四象限工作法举例");
        example.add("content", "<p>在考虑行事的先后顺序时，应先考虑事情的“轻重”，再考虑事情的“缓急”，也就是我们通常采用的“第二象限组织法”。"
                + "</p><p>用时间管理的方法来探讨“急事”与“要事”的关系，请看四象限图：</p><p>1、第一象限是重要又急迫的事。" +
                "</p><p>&nbsp; &nbsp; &nbsp; 举例：诸如应付难缠的客户、准时完成工作、紧急的工作汇报等等。</p><p>" +
                "2、第二象限是重要但不紧急的事。</p><p>&nbsp; &nbsp; &nbsp; 举例：主要是与生活品质有关，包括长期的规划、" +
                "问题的发掘与预防、参加培训等等事项。</p><p>3、第三象限是紧急但不重要的事。</p><p>&nbsp; &nbsp; &nbsp; " +
                "举例：电话、会议、突来访客都属于这一类。</p><p>4、第四象限属于不紧急也不重要的事。</p><p>&nbsp; &nbsp;" +
                " &nbsp;举例：阅读令人上瘾的无聊小说、毫无内容的电视节目、办公室聊天等。</p>\n");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("title", "四象限工作法的作用");
        example.set("content", "<p>&nbsp; &nbsp; &nbsp; &nbsp; 在学历、知识等各种基本素质相差无几之时，什么能够让你脱颖而出呢？" +
                "职业化能力！职业化的习惯！不需要特别的意志努力，不需要别人的监控，在什么情况下就按什么规则去行动。" +
                "</p><p>&nbsp; &nbsp; &nbsp; &nbsp; 而时间管理则是一个最基本的习惯，它是你工作是否高效的基础。" +
                "条件基本相同的两个人同时面对相同的工作量，有的焦头烂额，而有的轻松自如，问题出在哪里呢？就是分清工作的轻重缓急！</p>");
        zenStorageEngine.execute("put/thing", example, user);
        example.set("quadrant", "b");
        example.set("title", "什么是四象限工作法？");
        example.set("content", "把工作按照重要和紧急两个不同的程度进行了划分，基本上可以分为四个象限：既紧急又重要、重要但不紧急、紧急但不重要、既不紧急也不重要。");
        zenStorageEngine.execute("put/thing", example, user);

    }
}
