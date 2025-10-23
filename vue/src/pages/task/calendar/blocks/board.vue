<template>
    <div class="k-calendar">
        <div ref="cal"></div>
        <z-action ref="add" id="addThing" width="480" title="新建待办">
            <AddThing @update="addThing" />
        </z-action>
    </div>
</template>
<script>
import AddThing from './addThing.vue';
import Convert from "./convert";
import Lang from "./lang";

export default {
    inject: ['profile', '$dict'],
    components: { AddThing },
    props: {
        things: Array
    },
    data() {
        return {
            calendar: null,
            currentEvt: null,
            eventDate: null,
            colors: {}
        };
    },
    async mounted() {
        const quadrants = this.$dict('quadrantType')
        quadrants.v.forEach(item => {
            this.colors[item.value] = item.color
        });
        Lang();
        let config = {
            plugins: FullCalendar.globalPlugins,
            initialView: "timeGridWeek",
            headerToolbar: {
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek",
            },
            timeGrid: {

            },
            locale: "zh-cn",
            navLinks: false,
            timezone: "Asia/Shanghai",
            fixedWeekCount: false,
            aspectRatio: 1.8,
            windowResizeDelay: 300,
            selectable: true,
            dayMaxEvents: true,
            select: this.add,
            eventClick: this.detail,
            eventResize: this.change,
            eventDrop: this.change,
            minTime: "06:00:00",
            maxTime: "23:00:00",
            scrollTime: "08:00:00",
            editable: true, // 控制是否可以拖拽事件
            eventLimit: true, // allow "more" link when too many events
            droppable: true, // will let it receive events!
            eventReceive: function (info) {
                console.log("event received!", info.event);
            },
        };
        config.events = Convert(this.things, this.colors);
        this.calendar = new FullCalendar.Calendar(this.$refs['cal'], config);
        this.calendar.render();
        $.on("thingUpdate", this.update);
    },
    unmounted() {
        $.off('thingUpdate')
    },
    methods: {
        change(event) {
            let data = {
                id: event.event.id,
                start: event.event.start.getTime() / 1000,
            };
            if (event.event.end) {
                data.end = event.event.end.getTime() / 1000;
            }
            $.post({ data, url: "/do/patch/thing" });
        },
        update(thing) {
            if (!thing) {
                return
            }
            if (this.profile && thing.owner !== this.profile.id) {
                return this.remove(thing.id);
            }
            let event = this.calendar.getEventById(thing.id);
            if (event) {
                event.remove();
            }
            let result = {
                color: this.colors[thing.quadrant],
                id: thing.id,
                start: thing.start * 1000,
                title: thing.title,
            };
            this.calendar.addEvent(result);
        },
        add({ start, end }) {
            this.eventDate = { start, end }
            // 添加新建任务
            $.emit("addThing");
        },
        async addThing(data) {
            const { start, end } = this.eventDate;
            data.start = $.dayjs(start).unix()
            end && (data.end = $.dayjs(end).unix())
            let { id } = await $.post({ url: "/do/put/thing", data }, this);
            let result = Convert(data, this.colors);
            result.id = id
            this.calendar.addEvent(result);
            this.$refs['add'].close()
        },
        detail(calEvent) {
            this.currentEvt = calEvent;
            const { id } = calEvent.event
            $.emit("thingDetail", { id });
        },
        remove(id) {
            // 删除事件
            this.calendar.removeEvents([id]);
        },
    },
};
</script>
