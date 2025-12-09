<template>
    <div class="top">
        <z-icon value="edit" />
        <el-input v-model="value.title" type="textarea" :autosize="{ minRows: 1, maxRows: 3 }" :disabled="true"
            maxlength="120" />
    </div>
    <div class="time">
        <z-user :value="value.createUid" />
        创建于：
        <z-idate :value="value.id"></z-idate>
        <z-text v-if="value.projectId" depend="project" :modelValue="value.projectId" />
    </div>
    <More :value="value" />
    <Plan :value="value" />
</template>
<script>
import More from './more.vue';
import Plan from './plan.vue';
export default {
    components: { More, Plan },
    data() {
        return {
            currentDate: new Date(),
        };
    },
    name: "viewDetailHeader",
    props: ["value"],
};
</script>
<style lang="scss" scoped>
.top {
    display: flex;
    align-items: center;
    gap: 10px;
}

.a-row {
    margin-bottom: 16px;
}

.a-icon {
    font-size: 20px;
    font-weight: 600;
}

.a-text {
    margin-left: 10px;
}

.a-textarea {
    font-size: 20px;
    font-weight: 600;
    border: 1px solid var(--a-border-color);
    color: var(--a-text-color-primary);
    background: var(--a-fill-color-light);
    width: 95%;
    border-radius: 3px;
}

:deep(.a-textarea__inner) {
    box-shadow: none;
    background: none;
}

.time {
    color: var(--a-text-color-secondary);
    font-size: var(--a-font-size-base);
    margin: 6px 0 12px 24px;
    position: relative;
}
</style>

