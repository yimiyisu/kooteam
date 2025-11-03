<template>
    <div v-if="load">
        <z-page-title value="应用日志">
            <span class="page-action">
                <z-icon @click="last" v-if="params.page > 1" :tooltip="'第' + (params.page - 1) + '页'" value="chevronLeft"
                    :disabled="lastDisabled" />
                <z-icon @click="next" :tooltip="'第' + (params.page + 1) + '页'" value="chevronRight" :disabled="nextDisabled" />
                <el-button type="primary" @click="refresh">刷新</el-button>
            </span>
        </z-page-title>
        <z-block url="/api/system/log" :params="params" @finish="finish">
            <template #default="list">
                <z-form :data="params" :fields="fields" @change="change" type="search" />
                <el-timeline>
                    <el-timeline-item v-for="(item, index) in list" :key="index" center :timestamp="item.formatTime"
                        placement="top">
                        <pre>{{ item.message }}</pre>
                    </el-timeline-item>
                </el-timeline>
            </template>
        </z-block>
    </div>
</template>

<script>

export default {
    data() {
        return {
            fields: null,
            load: false,
            params: null,
            lastDisabled: false,
            nextDisabled: false,
        }
    },
    async created() {
        const { logMapping } = await $.get({ url: "/api/system/logMapping" })
        this.fields = [{
            name: 'app', label: '相关应用', type: 'select', options: logMapping.map(({ name, title }) => {
                return { value: name, label: title }
            })
        },
        { name: 'date', label: '日志时间', type: 'date' }]
        this.params = { app: logMapping[0].name || "", page: 1 ,limit:10};
        this.load = true;
    },
    methods: {
        last() {
            this.params = {
                ...this.params,
                page: this.params.page-1,
            }
        },
        next() {
            this.params = {
                ...this.params,
                page: this.params.page+1,
            }
        },
        finish(data) {
            console.log(this.params.page)
            this.lastDisabled = this.params.page <= 1;
            this.nextDisabled = data.length < this.params.limit;
        },
        change(formData) {
            debugger
            this.params = {
                app: formData.app,
                page: 1,
                date: formData.date
            };
        },
        refresh() {
            this.params = {
                ...this.params,
                page: 1,
                random: $.uid()
            }
        }
    }
}
</script>
<style scoped>
.page-action {
    margin-left: 12px;
}
</style>