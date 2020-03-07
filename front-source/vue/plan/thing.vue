<template>
    <tr :class="{'empty':data.start===0}">
        <th>
            <div class="thing">{{data.title}}</div>
        </th>
        <td :date="start.date"
            :key="'thing'+data._id" :class="{'weekend':start.isWeekend}">
            <div :class="'scale '+ data.quadrant" @dblclick="show" v-show="data.start>0"
                 :style="css" v-tip="'时间提示'"></div>
        </td>
        <td v-for="(item,idx) in scales" @click="addDate(idx)"
            :key="'thing'+data._id+idx" :class="{'weekend':item.isWeekend}">
        </td>
    </tr>
</template>
<script>
    const second = 86400, span = 45;// 一天的秒数与单元格默认长度
    export default {
        props: ["scales", "value", "length", "start", "time"],
        data: function () {
            return {
                data: {},
                lefe: 0,
                width: 0,
                css: ""
            }
        },
        created: function () {
            this.data = this.value;
            this.left = (Math.floor((this.data.start - this.time) / second) + 60) * span;
            this.width = (this.data.end - this.data.start) * span / second;
            this.css = "left:" + this.left + "px;width:" + this.width + "px";
        },
        methods: {
            addDate: function (idx) {
                if (!$(this.$el).hasClass("empty")) {
                    return;
                }
                let left = (idx + 1) * span;
                let width = 45;
                this.data.start = (idx - 59) * second + this.time;
                this.css = "left:" + left + "px;width:" + width + "px";
                this.save(left, width);
            },
            show: function () {
                $.emit("thingDetail", this.data);
            },
            save: function (left, width) {
                this.left = left;
                this.width = width;
                let start = (left / span - 60) * second + this.time;
                if (isNaN(start)) {
                    return;
                }
                this.data.start = start;
                this.data.end = (width / span) * second + start;
                $.post(this.data, "/thing/patch.do", function () {
                }, this);
            }
        }
    }
</script>