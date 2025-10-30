package com.yimiyisu.kooteam.events;

import com.google.common.eventbus.Subscribe;
import com.yimiyisu.kooteam.domain.ThingDO;
import com.yimiyisu.kooteam.domain.WorkDayDO;
import com.yimiyisu.kooteam.events.model.ThingEmailEventModel;
import com.yimiyisu.kooteam.events.model.ThingRepeatLoopEventModel;
import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Crontab;
import com.zen.annotation.Inject;
import com.zen.interfaces.IEvent;
import com.zen.kit.*;

import java.util.List;
import java.util.Map;

//@Crontab("1 1 0 * * ? *")
//@Crontab("0 */1 * * * ? *")
public class ThingRepeatLoopEvent implements IEvent<ThingRepeatLoopEventModel> {

    @Inject
    private ZenEngine zenEngine;
    private final long DAY = 24 * 60 * 60;

    @Override
    @Subscribe
    public void execute(ThingRepeatLoopEventModel thingRepeatLoopEventModel) {
        // 查询重复任务
        ZenResult repeatThingsResult = zenEngine.execute("list/repeat_thing", ZenData.create());
        if (repeatThingsResult.isEmpty()) return;
        List<ThingDO> thingRepeatList = repeatThingsResult.asList(ThingDO.class);

        // 查询今天是否为工作日
        Boolean workDay = isWorkDay();
        if (workDay == null) return;

        // 创建新待办
        for (ThingDO thingDO : thingRepeatList) {
            createThing(thingDO, workDay);
        }
    }

    /**
     * 接口文档：http://timor.tech/api/holiday
     * 判断当前时间是否为工作日
     * @return boolean
     */
    private Boolean isWorkDay() {
        String dateStr = DateKit.toString(DateKit.now(), "yyyy-MM-dd");
        String url = "http://timor.tech/api/holiday/info/" + dateStr;
        String responseStr = HttpKit.get(url);
        if (StringKit.isEmpty(responseStr)) return null;
        WorkDayDO response = JsonKit.parse(responseStr, WorkDayDO.class);
        int code = response.getCode();
        if (code != 0) return null;

        int dayType = response.getType().getType();
        return dayType == 0; // 0表示今天是工作日
    }

    // 创建待办
    private void createThing(ThingDO thing, boolean workDay) {
        int type = thing.getType(); // 重复任务类型
        String owner = StringKit.isEmpty(thing.getOwner()) ? thing.getCreator() : thing.getOwner();
        String thingId = "";
        String preTitle = type == 1 ? "(每日任务)" : "(工作日任务)";
        if (type == 1 || (workDay && type == 2)) { // 每日重复 || 工作日&&工作日重复
            ZenResult putThingResult = zenEngine.execute("put/thing_repeat", ZenData.create()
                            .put("createGmt", DateKit.now())
                            .put("start", DateKit.today())
                            .put("end", DateKit.today() + DAY)
                            .put("create_uid", thing.getCreator())
                            .put("status", 0)
                            .put("updateGmt", DateKit.now())
                            .put("title", thing.getTitle() + preTitle)
                            .put("content", thing.getContent())
                            .put("file", thing.getFile())
                            .put("owner", owner)
                            .put("quadrant", thing.getQuadrant()));
            thingId = putThingResult.get("id");
        }

        // 调用异步通知负责人
        ThingEmailEventModel emailEventModel = ThingEmailEventModel.builder()
                .from(thing.getCreator())
                .thingId(thingId)
                .type(1)
                .build();
        EventKit.trigger(emailEventModel);
    }
}
