<template>
    <div class="tip">
        <z-tooltip v-if="number==='1'" content="文本文档">
            <i class="doc-icon ft icon">&#xe7be;</i>
        </z-tooltip>
        <z-tooltip v-if="number==='2'" content="思维导图">
            <i class="doc-icon ft icon">&#xe787;</i>
        </z-tooltip>
        <z-tooltip v-if="number==='5'" content="流程图">
            <i class="doc-icon ft icon">&#xe779;</i>
        </z-tooltip>
        <z-tooltip v-if="number==='6'" content="表格">
            <i class="doc-icon ft icon">&#xe7ad;</i>
        </z-tooltip>
        <z-tooltip v-if="number==='4'" content="文件夹">
            <i class="doc-floder ft icon" :class="{'lap':!value.status}"></i>
        </z-tooltip>
        <z-tooltip v-if="!number" content="此文档尚未创建">
            <i class="doc-icon ft icon">&#xe76e;</i>
        </z-tooltip>
    </div>
</template>
<script>
    export default {
        props: ["value"],
        computed: {
            number() {
                if (!this.value || !this.value.type) {
                    return '';
                }
                return this.value.type + '';
            }
        }
    }
</script>