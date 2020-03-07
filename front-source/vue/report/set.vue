<template>
    <z-tabs :value="'first'">
        <z-form label-position="left" label-width="120px">
            <h4>周报模版</h4>
            <z-field label="周报状态">
                <z-switch v-model="config.week"></z-switch>
            </z-field>
            <z-field label="每周生成时间" v-if="config.week">
                <z-select v-model="config.weekNumber">
                    <var value="1">周一</var>
                    <var value="2">周二</var>
                    <var value="3">周三</var>
                    <var value="4">周四</var>
                    <var value="5">周五</var>
                    <var value="6">周六</var>
                    <var value="7">周日</var>
                </z-select>
                <z-time placeholder="自动生成时间" v-model="config.weekTime"></z-time>
            </z-field>
            <z-field label="日报状态">
                <z-switch v-model="config.daily"></z-switch>
            </z-field>
            <z-field label="每天生成时间" v-if="config.daily">
                <z-time placeholder="请选择时间点" v-model="config.dailyTime"></z-time>
            </z-field>
            <z-field>
                <z-button type="primary" @click="save">保存</z-button>
            </z-field>
        </z-form>
        <z-tab-pane label="日报模版" name="second">
            <h4>日报模版</h4>
            <Blocks></Blocks>
            <div class="formate" data-type="daily">
                <div class="block-item" v-for="item in config.dailyConfig" :key="item.name">{{item.title}}</div>
            </div>
        </z-tab-pane>
    </z-tabs>
</template>
<script>
    import Blocks from "./blocks"

    export default {
        components: {Blocks},
        data: function () {
            return {
                list: ["plan", "done"],
                config: {}
            }
        },
        mounted: function () {
            $.post(null, "/report/config.do", function (reback) {
                this.config = reback.data;
            }, this);
        },
        methods: {
            save: function () {
                let data = new FormData();
                data.append("report", JSON.stringify(this.config));
                $.post({report: JSON.stringify(this.config)}, "/report/put.do", function (reback) {
                    $.action(reback);
                }, this);

            },
            move: function () {
                let that = this;
                $(".blocks", this.$el).el.forEach((el) => {
                    $.draggable(el, {
                        group: {
                            name: 'report',
                            pull: "clone",
                            revertClone: true,
                            put: false // Do not allow items to be create into this list
                        },
                        animation: 150,
                        sort: false
                    });
                });
                $(".formate", this.$el).el.forEach((el) => {
                    $.draggable(el, {
                        group: 'report',
                        animation: 150,
                        scroll: true,
                        setData: function (dataTransfer, dragEl) {
                            dataTransfer.setData('Text', dragEl.textContent); // `dataTransfer` object of HTML5 DragEvent
                        },
                        onAdd: function (evt) {
                            let itemEl = evt.item,
                                type = $(evt.target).data("type"),
                                source = $(itemEl).data("name");
                            if (type === "week") {
                                that.week.push(source);
                            }
                            $(itemEl).remove();
                        },
                        onEnd: function (/**Event*/evt) {
                            let itemEl = evt.item;  // dragged HTMLElement
                            // evt.to;    // target list
                            // evt.from;  // previous list
                            // evt.oldIndex;  // element's old index within old parent
                            // evt.newIndex;  // element's new index within new parent
                        }
                    });
                });
            }
        }
    }
</script>