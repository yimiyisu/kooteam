<template>
    <div style="margin: 20px">
        <div id='calendar'></div>
        <k-todo-add :value="eventData" :visible="isShow" :is-cal="true"></k-todo-add>
    </div>
</template>
<script>
    import Util from "./util"

    export default {
        props: ["value"],
        data: function () {
            return {
                calendar: null,
                currentEvt: null,
                eventData: {},
                isShow: false
            }
        },
        mounted: function () {
            $.lib(["/calendar/main.min.js", "/calendar/interaction/min.js", "/calendar/daygrid/min.js", "/calendar/timegrid/min.js"], this.init);
            $.on("thingUpdate", this.update);
        },
        methods: {
            init: function () {
                let config = {
                    plugins: ['interaction', 'dayGrid', 'timeGrid'],
                    header: {
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek'
                    },
                    locale: "zh-cn",
                    navLinks: true,
                    timezone: "Asia/Shanghai",
                    fixedWeekCount: false,
                    aspectRatio: 1.8,
                    windowResizeDelay: 300,
                    selectable: true,
                    selectHelper: true,
                    select: this.add,
                    eventClick: this.detail,
                    eventResize: this.change,
                    eventDrop: this.change,
                    minTime: "06:00:00",
                    maxTime: "23:00:00",
                    scrollTime: "08:00:00",
                    editable: true,  // 控制是否可以拖拽事件
                    eventLimit: true, // allow "more" link when too many events
                    events: []
                };

                config.defaultDate = new Date();
                config.events = Util.convert(this.value);
                this.calendar = new FullCalendar.Calendar(document.getElementById('calendar'), config);
                this.$nextTick(function () {
                    this.calendar.render();
                    this.calendar.refetchEvents();//修复周模式下事件错乱
                });
            },
            change: function (event) {
                let data = {
                    _id: event.event.id,
                    start: event.event.start.getTime() / 1000
                };
                if (event.event.end) {
                    data.end = event.event.end.getTime() / 1000;
                }
                $.http(data, "/thing/patch.do", function (reback) {
                }, this);
            },
            update: function (thing) {
                if (thing.owner !== zen.user.id) {
                    return this.remove(thing._id);
                }
                let event = this.calendar.getEventById(thing._id);
                event.remove();
                let result = {
                    color: Util.getColor(thing.quadrant),
                    id: thing._id,
                    start: thing.start * 1000,
                    title: thing.title
                };
                this.calendar.addEvent(result);
            },
            add: function (start, end) {
                this.isShow = true;
                this.eventData = {
                    start: start,
                    end: end
                };
            },
            addThing: function (data) {
                if (data) {
                    let result = Util.convert(data);
                    console.log(result);
                    this.calendar.addEvent(result);
                } else {
                    this.calendar.unselect();
                }
            },
            detail: function (calEvent, jsEvent, view) {
                this.currentEvt = calEvent;
                $.emit("thingDetail", calEvent.event.id);
            },
            remove: function (id) {
                // 删除事件
                this.calendar.removeEvents([id]);
            }
        }
    }
</script>