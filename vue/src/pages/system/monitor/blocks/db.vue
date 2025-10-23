<template>
    <el-descriptions v-for="(item, idx) in value" :key="idx" label-width="180px" :title="'数据库连接池：' + item.poolName"
        :column="4" border>
        <el-descriptions-item label="链接模式">
            {{ item.poolMode }}
        </el-descriptions-item>
        <el-descriptions-item label="最大连接数">
            {{ item.poolMaxSize }}
        </el-descriptions-item>
        <el-descriptions-item label="当前链接数">
            {{ item.poolState }}
        </el-descriptions-item>
        <el-descriptions-item label="最大空闲数">
            {{ item.idleSize }}
        </el-descriptions-item>
        <el-descriptions-item label="使用中数量">
            {{ item.borrowedSize }}
        </el-descriptions-item>
        <el-descriptions-item label="链接排队量">
            {{ item.semaphoreWaitingSize + item.transferWaitingSize }}
        </el-descriptions-item>
        <el-descriptions-item label="创建中数量">
            {{ item.creatingCount }}
        </el-descriptions-item>
        <el-descriptions-item label="创建超时数量">
            {{ item.creatingTimeoutCount }}
        </el-descriptions-item>
    </el-descriptions>
</template>
<script>
export default {
    inheritAttrs: false,
    props: {
        value: Array
    }
}
</script>