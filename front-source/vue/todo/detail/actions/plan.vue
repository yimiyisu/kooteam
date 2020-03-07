<template>
    <z-popover v-model="visible">
        <z-date type="datetime" v-model="text" :clearable="false"></z-date>
        <div class="operator">
            <z-button plain size="mini" @click="close">取消</z-button>
            <z-button size="mini" type="primary" @click="submit">确定</z-button>
        </div>
        <template slot="reference">
            <span class="btn">
                <i class="ft icon">&#xe706;</i>完成时间
            </span>
        </template>
    </z-popover>
</template>
<script>
    export default {
        data() {
            return {
                thing: null,
                text: "",
                visible: false
            }
        },
        inject: ["getThing", "log"],
        created() {
            this.thing = this.getThing();
            this.text = $.date(this.thing.start);
        },
        methods: {
            close() {
                this.visible = false;
            },
            submit() {
                let time = new Date(this.text).getTime() / 1000;
                $.post({_id: this.thing._id, start: time}, '/thing/patch.do', (reback) => {
                    this.visible = false;
                    this.log("将该任务的到期日更改为 " + $.date(time));
                    this.thing.start = time;
                });
            }
        }
    }
</script>
