<template>
    <div class="repeat">
        <div class="repeat-type">
            重复方式
            <span>
                {{repeats[repeatType]}}
                <ul>
                    <li v-for="(name,idx) in repeats" @click="change(idx)" :key="idx">{{name}}</li>
                </ul>
            </span>
        </div>
        <div class="weeks" v-show="repeatType===1">
                    <span v-for="(item,idx) in weeks" :key="idx" @click="selectWeek(idx,$event)"
                          :class="{active:weekSelected.indexOf(idx) > -1}">
                        {{item}}
                    </span>
        </div>
        <div class="days" v-show="repeatType===2">
                    <span v-for="(item,idx) in days" :key="idx" @click="selectDay(idx,$event)"
                          :class="{active:daySelected.indexOf(idx) > -1}">
                        {{item}}
                    </span>
        </div>
        <div class="repeat-time">
            <input type="text" class="J_calendar-2" placeholder="请选择时间点"/>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["value"],
        data: function () {
            return {
                repeatType: 1,
                time: "9:00",
                result: [],
                repeats: ["每天", "每周", "每月"],
                weeks: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                days: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                    19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
                weekSelected: [],
                daySelected: [],
                selected: {},
            }
        },
        mounted: function () {
            let that = this, data = this.value;
            this.repeatType = data.type;
            if (data.type === 1) {// 周模式
                this.weekSelected = data.data;
            }
            if (data.type === 2) {// 月模式
                this.daySelected = data.data;
            }
            this.selected = data;
            $(".J_calendar-2", this.$el).el.flatpickr({
                enableTime: true,
                noCalendar: true,
                dateFormat: "H:i",
                defaultDate: this.time,
                time_24hr: true,
                onChange: function (selectedDates, dateStr) {
                    that.time = dateStr;
                    this.emit();
                }
            });
        },
        methods: {
            change: function (type) {
                this.repeatType = type;
                this.emit();
            },
            selectWeek: function (idx) {
                let tempIndex = this.weekSelected.indexOf(idx);
                if (tempIndex > -1) {
                    this.weekSelected.splice(tempIndex, 1)
                } else {
                    this.weekSelected.unshift(idx);
                }
                this.emit();
            },
            selectDay: function (idx) {
                let tempIndex = this.daySelected.indexOf(idx);
                if (tempIndex > -1) {
                    this.daySelected.splice(tempIndex, 1)
                } else {
                    this.daySelected.unshift(idx);
                }
                this.emit();
            },
            emit: function () {
                if (this.repeatType === 1) {// 周模式
                    this.selected.data = this.weekSelected;
                }
                if (this.repeatType === 2) {// 月模式
                    this.selected.data = this.daySelected;
                }
                this.selected.time = this.time;
                this.selected.type = this.repeatType;
                this.$emit("input", this.selected);
            }
        },
    }
</script>