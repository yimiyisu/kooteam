<template>
    <z-popover v-model="visible">
        <z-date type="datetimerange" @confirm="submit"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :default-time="['9:00:00', '12:00:00']"
                :value="text" :clearable="false"></z-date>
        <template slot="reference">
            <span class="ft hover icon">&#xe6dd;</span>
        </template>
    </z-popover>
</template>
<script>

    export default {
        props: ["value"],
        data() {
            return {
                text: [],
                visible: false
            }
        },
        inject: ["log"],
        created() {
            let thing = this.value;
            this.text.push($.date(thing.start));
            if (thing.end) {
                this.text.push($.date(thing.end));
            }
        },
        watch: {
            visible(val) {
                this.$parent.active = val;
            }
        },
        methods: {
            close() {
                this.visible = false;
            },
            submit(val) {
                let thing = this.value,
                    start = new Date(val[0]).getTime() / 1000,
                    end = new Date(val[1]).getTime() / 1000;
                $.post({_id: thing._id, start: start, end: end}, '/thing/patch.do', (reback) => {
                    thing.end = end;
                    thing.start = start;
                    this.visible = false;
                    this.log("将【" + thing.title + "】时间调整为:" + $.date(start) + "至" + $.date(end));
                }, this);
            }
        }
    }
</script>