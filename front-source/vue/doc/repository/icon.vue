<template>
    <div class="tip">
        <i class="doc-txt" v-if="type===1" v-tip="'文本文档'"></i>
        <i class="doc-mind" v-if="type===2" v-tip="'思维导图'"></i>
        <i class="doc-graph" v-if="type===3" v-tip="'流程图'"></i>
        <i class="doc-graph" v-if="type===5" v-tip="'流程图'"></i>

        <i class="z-icon why" v-if="!type" v-tip="'此文档尚未创建'">&#xe8fd;</i>
    </div>
</template>
<script>
    export default {
        props: ["type"]
    }
</script>