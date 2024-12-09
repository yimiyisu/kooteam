<template>
    <z-block url="/do/get/week" :params="params">
        <template #default="data">
            <!-- {{ id }}----
            {{ params }} -->
            <div class="mce-content-body">
                <el-descriptions border>
                    <el-descriptions-item label="发送人">
                        <z-user :plain="false" :value="data.uid" />
                    </el-descriptions-item>
                    <el-descriptions-item label="发送时间">
                        {{data}}
                        <z-idate :value="data.timer">
                            <!-- {{ data.timer }} -->
                        </z-idate>
                        <!-- {{ format(data.timer) }} -->
                    </el-descriptions-item>
                </el-descriptions>
                <div v-html="data.content"></div>
                <div v-if="data.summary">
                    <h1>总结与思考</h1>
                    <pre>
                        {{ data.summary }}
                    </pre>
                </div>
            </div>
            <el-button @click="prevDocument">上一篇</el-button>
            <el-button @click="nextDocument">下一篇</el-button>
        </template>
    </z-block>
</template>
<script>
export default {
    props: {
        id: String
    },
    data() {
        return {
            params: null
        }
    },
    created() {
        this.params = { id: this.id };
        this.fetchData();
    },
    methods: {
        async fetchData() {
            try {
                const result = await $.get({ url:'/do/get/week', data: this.params });
                this.data = result; 
                return result;
            } 
            catch (error) {
                console.error('获取数据出错：', error);
                return null;
            }
        },
        async prevDocument() {
            const result = await $.get({ url: '/do/list/lastWeek', data: { id: this.params.id, size: 2 } });
            if (result && result.length > 0) {
                this.params.id = result[0].id;
                const newData = await this.fetchData();
                console.log('newData', newData);
            }
            console.log('result', result);
            console.log('this.params.id', this.params.id);
        },
        async nextDocument() {
            const result = await $.get({ url: '/do/list/nextWeek', data: { id: this.params.id, size: 2 } });
            if (result && result.length > 0) {
                this.params.id = result[0].id;
                const newData = await this.fetchData();
                console.log('newData', newData);
            }
            console.log('result', result);
            console.log('this.params.id', this.params.id);
        },
    // created() {
    //     this.params = { id: this.id }
    // },
    // methods: {
    //     async prevDocument() {
    //         const result = await $.get({ url: '/do/list/nextWeek', data: { id: this.params.id, size: 2 } })
    //         if (result && result.length > 0) {
    //             this.params.id = result[0].id
    //             debugger
    //         }
    //         console.log('result',result)
    //         console.log('this.params.id',this.params.id)
    //     },
    //     // nextDocument() {
    //     //     this.currentUrl = this.currentUrl.replace('week', 'nextWeek');
    //     // }
    }
}
</script>