<template>
    <z-popover v-model="visible">
        <z-date type="datetimerange" @confirm="submit"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['9:00:00', '12:00:00']"
                :value="text" :clearable="false"></z-date>
        <template slot="reference">
            <span class="btn">
                <i class="ft icon">&#xe706;</i>计划时间
            </span>
        </template>
    </z-popover>
</template>
<script>
    export default {
        data() {
            return {
                text: [],
                visible: false
            }
        },
        inject: ["getThing", "log"],
        created() {
            let thing = this.getThing();
            this.text.push($.date(thing.start));
            if (thing.end) {
                this.text.push($.date(thing.end));
            }
        },
        methods: {
            close() {
                this.visible = false;
            },
            submit(val) {
                let thing = this.getThing(),
                    start = new Date(val[0]).getTime() / 1000,
                    end = new Date(val[1]).getTime() / 1000;
                $.post({_id: thing._id, start: start, end: end}, '/thing/patch.do', (reback) => {
                    thing.end = end;
                    thing.start = start;
                    this.visible = false;
                    this.log("将计划时间调整为 " + $.date(start) + "至" + $.date(end));
                }, this);
            }
        }
    }
</script>
