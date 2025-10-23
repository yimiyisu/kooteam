<template>
    <z-block :url="url">
        <template #default="{ basic, now, tag, db = [], threads }">
            <el-descriptions v-if="basic" label-width="180px" title="应用参数" :column="3" border>
                <el-descriptions-item label="应用名">
                    {{ basic.appName }}
                    <IRefreshCcw tooltip="刷新监控" class="hover" style="margin-left:6px" @click="refresh" />
                </el-descriptions-item>
                <el-descriptions-item label="总运行时长">
                    {{ basic.hours }}小时
                </el-descriptions-item>
                <el-descriptions-item label="程序版本号">
                    {{ tag }}
                </el-descriptions-item>
                <el-descriptions-item label="监控时间">
                    <z-date :value="now" />
                </el-descriptions-item>
                <el-descriptions-item label="最大堆内存">
                    {{ basic.maxHeapMemoryInfo }}
                </el-descriptions-item>
                <el-descriptions-item label="使用中的堆内存">
                    {{ basic.usedHeapMemoryInfo }}
                </el-descriptions-item>
                <el-descriptions-item label="异步事件排队量">
                    {{ basic.queueSize }}
                </el-descriptions-item>
            </el-descriptions>
            <el-descriptions label-width="180px" style="margin:20px 0" title="系统信息" :column="3" border>
                <el-descriptions-item label="系统名称">
                    {{ basic.name }}
                </el-descriptions-item>
                <el-descriptions-item label="系统架构">
                    {{ basic.arch }}
                </el-descriptions-item>
                <el-descriptions-item label="CPU使用率">
                    {{ basic.cpuLoadInfo }}
                </el-descriptions-item>
                <el-descriptions-item label="JVM的CPU使用率">
                    {{ basic.processCpuLoadInfo }}
                </el-descriptions-item>
                <el-descriptions-item label="系统总内存">
                    {{ basic.totalMemoryInfo }}
                </el-descriptions-item>
                <el-descriptions-item label="系统空闲内存">
                    {{ basic.freeMemoryInfo }}
                </el-descriptions-item>
            </el-descriptions>
            <Db :value="db" />
            <Threads :threads="threads" />
        </template>
    </z-block>
</template>

<script>
import IRefreshCcw from '@icons/refresh-ccw';
import Db from './db.vue';
import Threads from './threads.vue';
export default {
    props: {
        name: String
    },
    components: { Threads, IRefreshCcw, Db },
    data() {
        return { counter: 0 }
    },
    computed: {
        url() {
            return `/${this.name}/api/zen/monitor?_rd_=${this.counter}`;
        }
    },
    methods: {
        refresh() {
            this.counter++
        }
    },
}
</script>