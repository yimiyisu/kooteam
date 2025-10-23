<template>
    <z-block url="/do/get/week" :params="params" v-if="show">
        <template #default="data">
            <div class="mce-content-body">
                <el-descriptions border>
                    <el-descriptions-item label="发送人">
                        <z-user :plain="false" :value="data.uid" />
                    </el-descriptions-item>
                    <el-descriptions-item label="发送时间">
                        <z-date :value="data.timer" />
                    </el-descriptions-item>
                </el-descriptions>
                <div v-html="data.content"></div>
                <div v-if="data.summary">
                    <h1>总结与思考</h1>
                    <div class="ml-2">
                        {{ data.summary }}
                    </div>
                </div>
            </div>
        </template>
    </z-block>
</template>
<script>
export default {
    props: {
        week: Object
    },
    data() {
        return {
            params: null,
            show: false
        }
    },
    async created() {
        this.params = { id: this.week.weekId };
        if(this.week.status === 0){
            this.week.status = 1;
            await $.get({
                url: '/do/patch/week_recieve',
                data: this.week,
                success: () => {}
            })
        }
        this.show = true;
    },
}
</script>