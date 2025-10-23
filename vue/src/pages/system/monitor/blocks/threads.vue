<template>
    <div style="margin-top:12px">
        <z-page-title value="线程列表" />
        <el-table :data="currentPageData" style="width: 100%">
            <el-table-column fixed prop="threadId" label="线程ID" width="100" />
            <el-table-column prop="threadName" label="线程名称" />
            <el-table-column prop="threadState" label="线程状态" />
            <el-table-column prop="cpuTime" label="CPU占用时间/ms" />
            <!-- <el-table-column>
            <template #default="scope">
                <el-button link type="primary" size="small" @click="remove(scope)">删除</el-button>
            </template>
</el-table-column> -->
        </el-table>
        <el-pagination layout="total, prev, pager, next" :total="total" :page-size="pageSize"
            :current-page="currentPage" @current-change="change" style="margin-top: 20px;" />
    </div>
</template>
<script>
export default {
    inheritAttrs: false,
    props: {
        threads: Array
    },
    watch: {
        threads() {
            this.currentPage = 1
        }
    },
    computed: {
        // 分页数据计算
        currentPageData() {
            const start = (this.currentPage - 1) * this.pageSize
            const end = this.currentPage * this.pageSize
            return this.threads.slice(start, end)
        },
        // 总条数
        total() {
            return this.threads ? this.threads.length : 0
        }
    },
    data() {
        return {
            currentPage: 1,
            pageSize: 10
        }
    },
    methods: {
        change(val) {
            this.currentPage = val
        },
        remove(scope) {
            const index = scope.$index
            const row = scope.row
            const globalIndex = (this.currentPage - 1) * this.pageSize + index;
            this.threads.splice(globalIndex, 1);
            if (this.currentPageData.length === 0 && this.currentPage > 1) {
                this.currentPage -= 1;
            }
            $.get({
                url: "/api/zen/monitor",
                data: { thread: row.threadId }
            })
        }
    },
}
</script>