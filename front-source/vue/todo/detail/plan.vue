<template>
    <div class="k-todo-plan">
        <label @click="show">
            {{text}}
        </label>
        <div class="calendar" v-show="isShow">
            <div class="z-row">
                <div class="z-12 modal">
                    <div class="day">
                        <span @click="changeModal(1)" :class="{'active':modal<4}">单日</span>
                        <!--<span @click="changeModal(1)" :class="{'active':modal<4}">{{name}}</span>-->
                        <!--<ul>-->
                        <!--<li @click="changeModal(0)" :class="{'active':modal===0}">单日</li>-->
                        <!--<li @click="changeModal(1)" :class="{'active':modal===1}">多日</li>-->
                        <!--<li @click="changeModal(2)" :class="{'active':modal===2}">起止</li>-->
                        <!--</ul>-->
                    </div>
                    <span @click="changeModal(4)" :class="{'active':modal===4}">重复</span>
                </div>
                <div class="z-12">
                    <div class="operator">
                        <z-button plain size="mini" @click="close">取消</z-button>
                        <z-button plain size="mini" type="primary" @click="submit">确定</z-button>
                    </div>
                </div>
            </div>
            <div v-show="modal<4">
                <div class="J_calendar"></div>
            </div>
            <Repeat v-if="cal" v-show="modal===4" v-model="selected" @choseRepeat="choseRepeat"></Repeat>
        </div>
    </div>
</template>
<script>
    import Repeat from "./repeat"

    export default {
        props: ["value"],
        data: function () {
            return {
                modal: 1,
                cal: null,
                thing: null,
                name: "单日",
                modals: ["", "单日", "多日", "起止", "重复"],
                range: [],
                text: "",
                dateStr: "",
                isShow: false,
                selected: {}, // 用于保存 repeat数据
            }
        },
        components: {Repeat},
        mounted: function () {
            let data = this.value;
            this.thing = data;
            if (data.plan) {
                this.modal = data.plan;
            }
            if (this.modal === 1) {
                this.text = $.date(data.start);
            } else {
                this.text = "重复任务";
            }
            this.name = this.modals[this.modal];
            if (this.modal > 1 && data.planContent) {
                this.selected = JSON.parse(data.planContent);
            }
        },
        methods: {
            show: function () {
                $.lib(["/flatpickr2/flatpickr.min.css", "/flatpickr2/flatpickr.min.js"],
                    this.init, null, this);
            },
            submit: function () {
                this.thing.plan = this.modal;
                if (this.modal === 4) {
                    this.text = "重复任务";
                    this.thing.planContent = JSON.stringify(this.selected);
                } else {
                    this.text = this.dateStr;
                    let date = new Date(this.dateStr);
                    let time = date.getTime() / 1000;
                    // 更新默认结束时间
                    if (!this.thing.end || this.thing.end < this.thing.start) {
                        this.thing.end = time + 7200;
                    }
                    this.thing.start = time;
                }
                this.$emit("input", this.thing);
                this.close();
            },
            close: function () {
                this.isShow = false;
            },
            changeModal: function (val) {
                if (val === this.modal) {
                    return;
                }
                if (val < 4) {
                    let models = ["", "single", "multiple", "range"];
                    this.name = this.modals[val];
                    this.cal.clear();
                    this.cal.set("mode", models[val]);
                }
                this.modal = val;
            },
            init: function () {
                this.isShow = true;
                if (this.cal) {
                    return;
                }
                let defVal = $.date(this.thing.start),
                    that = this,
                    models = ["", "single", "multiple", "range"];

                this.cal = $(".J_calendar", this.$el).el.flatpickr({
                    inline: true,
                    minDate: "today",
                    defaultDate: defVal,
                    mode: models[this.modal],
                    enableTime: true,
                    time_24hr: true,
                    onChange: function (selectedDates, dateStr) {
                        that.dateStr = dateStr;
                    }
                });
            },
            choseRepeat: function (selected) {
                this.modal = 4;
                this.selected = selected;
            }
        }
    }
</script>