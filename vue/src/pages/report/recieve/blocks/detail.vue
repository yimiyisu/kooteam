<template>
    <z-block :url="url" :params="params" v-if="show">
        <template #default="data">
            <div class="mce-content-body">
                <el-descriptions border style="margin-bottom: 20px;">
                    <el-descriptions-item label="发送人">
                        <z-user :plain="false" :value="data.uid == null ? data.creator : data.uid" />
                    </el-descriptions-item>
                    <el-descriptions-item label="发送时间">
                        <z-date :value="data.timer" />
                    </el-descriptions-item>
                </el-descriptions>
                <div>
                    <z-editor :modelValue="data.content" />
                </div>
                <!-- <div v-html="data.content"></div> -->
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
            show: false,
            url: "",
        }
    },
    async created() {
        if (this.week.weekId.includes("ai")) {
            this.url = "/do/get/ai_week"
            this.params = { id: this.week.weekId.replace("ai_", "") }
        } else {
            this.params = { id: this.week.weekId };
            this.url = "/do/get/week"
        }
        if (this.week.status === 0) {
            this.week.status = 1;
            await $.get({
                url: '/do/patch/week_recieve',
                data: this.week,
                success: () => { }
            })
        }
        this.show = true;
    },
}
</script>