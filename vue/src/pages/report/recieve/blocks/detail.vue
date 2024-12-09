<template>
    <!-- <z-block :url="currentUrl" :params="{ id: weekId }"> -->
        <z-block url="/do/get/week" :params="{ id: weekId }">
            <template #default="data">
                {{weekId}}
                {{params}}
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
                    <div class="ml-2">
                        {{ data.summary }}
                    </div>
                </div>
            </div>
        </template>
    </z-block>
    <el-button @click="prevDocument">上一篇</el-button>
    <el-button @click="nextDocument">下一篇</el-button>
</template>
<script>
export default {
    props: {
        weekId: String
    },
    created() {
        this.params = { id: this.weekId };
        this.fetchData();
    },
    // data() {
    //     return {
    //         params: null
    //     }
    // },
    computed: {
        params() {
            return { id: this.weekId }
        }
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
            const result = await $.get({ url: '/do/list/lastReceive', data: { id: this.params.weekId, size: 1 } });
            if (result && result.length > 0) {
                this.params.weekId = result[0].weekId;
                const newData = await this.fetchData();
                console.log('newData', newData);
            }
            console.log('result', result);
            console.log('this.params', this.params);
            console.log('this.params.weekId', this.params.weekId);
        },
        async nextDocument() {
            const result = await $.get({ url: '/do/list/nextReceive', data: { id: this.params.weekId, size: 1 } });
            if (result && result.length > 0) {
                this.params.weekId = result[0].weekId;
                const newData = await this.fetchData();
               console.log('newData', newData);
            }
            console.log('result', result);
            console.log('this.params', this.params);
            console.log('this.params.weekId', this.params.weekId);
        },
    }
}
</script>