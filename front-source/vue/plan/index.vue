<template>
    <div class="z-1">
        <div class="z-row header">
            <div class="z-20">盘古项目甘特图<i class="z-icon add" @click="add">&#xe148;</i></div>
            <div class="z-4" @click="startPosition">{{now.date}}<i class="z-icon hover">&#xe0c8;</i></div>
        </div>
        <div class="table-fixed">
            <span class="z-icon prev">&#xe408;</span>
            <span class="z-icon next">&#xe409;</span>
            <div class="wrap" id="J_wrap">
                <table>
                    <thead>
                    <Scale :data="scales" :start="start"></Scale>
                    </thead>
                    <tbody>
                    <Thing v-for="(thing,idx) in things" :key="thing._id" :time="time"
                           :start="start" v-model="things[idx]" :scales="scales"></Thing>
                    </tbody>
                </table>
            </div>
        </div>
        <k-todo-add :visible="isShow"></k-todo-add>
    </div>
</template>
<script>
    import Scale from "./scale"
    import Thing from "./thing"

    export default {
        props: ["value"],
        data: function () {
            return {
                scales: [],
                things: [],
                length: 180,
                isShow: false,
                now: {},
                time: 0,
                start: {},
            }
        },
        components: {Scale, Thing},
        mounted: function () {
            // this.things = this.value;
            this.projectId = $.getParam("id");
            $.http({"projectId": this.projectId}, "/select/thingByprojectId.json", function (reback) {
                if (reback.data) {
                    this.things = reback.data.data;
                }
            }, this);
            this.initScale();
            this.$nextTick(function () {
                this.startPosition();
            });
        },
        methods: {
            add: function () {
                this.isShow = true;
            },
            addThing: function (data) {
                data.start = 0;
                data.end = 0;
                this.things.unshift(data);
            },
            startPosition: function () {
                $("#J_wrap").scrollLeft(56 * 45);
            },
            initScale: function () {
                let span = -parseInt(this.length / 3);
                let now = new Date(), current;
                this.time = parseInt(now.getTime() / 1000);
                this.now = this.createScale(now);
                now.setDate(span);
                for (let i = 0; i < this.length; i++) {
                    now.setDate(now.getDate() + 1);
                    current = this.createScale(now);
                    if (i === 0) {// 第一个刻度，用于数据存储
                        this.start = current;
                    } else {
                        this.scales.push(current);
                    }
                }
            },
            createScale: function (now) {
                let current, date, day;
                date = now.getDate();
                current = {
                    date: null,
                    month: now.getMonth() + 1,
                    text: null, // 展示的内容
                    isWeekend: false, // 是否周末
                    isFirst: false // 是否每月的第一天
                };
                current.date = now.getFullYear() + "-" + current.month + "-" + date;
                if (date === 1) {
                    current.isFirst = true;
                    current.text = current.month + "月";
                } else {
                    if (date < 10) {
                        date = "0" + date;
                    }
                    current.text = date;
                }
                day = now.getDay();
                if (day === 0 || day === 6) {
                    current.isWeekend = true;
                }
                return current;
            }
        }
    }
</script>