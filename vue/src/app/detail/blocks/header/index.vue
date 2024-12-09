<template>
    <div class="top">
        <z-icon value="edit" />
        <input v-model="value.title" :disabled="readonly" maxlength="60" @change="change" />
    </div>
    <div class="time">
        <z-user :value="value.createUid" />
        创建于：
        <z-idate :value="value.id"></z-idate>
        <z-text v-if="value.projectId" depend="project" :modelValue="value.projectId" />
        <Action :value="value" />
    </div>
    <More :value="value" />
    <Plan :value="value" />
</template>
<script>
import Action from './action.vue';
import More from './more.vue';
import Plan from './plan.vue';
export default {
    components: { Action, More, Plan },
    data() {
        return {
            currentDate: new Date(),
        };
    },
    name: "detailHeader",
    props: ["value", "readonly"],
    // 注入
    methods: {
        // 当改变时 标题显示当前输入的 然后发送数据给
        async change() {
            await $.post({
                data: {
                    title: this.value.title,
                    id: this.value.id,
                },
                url: "/do/patch/thing",
            });
            $.emit("thingUpdate", this.value, "title");
        },
    },
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

input {
    font-size: 20px;
    font-weight: 600;
    border: 2px solid var(--a-border-color-extra-light);
    padding: 8px;
    cursor: pointer;
    color: var(--a-text-color-primary);
    background: var(--a-fill-color-light);
    width: 95%;
    border-radius: 3px;

    &:focus {
        border-color: var(--a-border-color);
        background: var(--a-fill-color-extra-light);
    }
}

.time {
    color: var(--a-text-color-secondary);
    font-size: var(--a-font-size-base);
    margin-top: 6px;
    position: relative;
}
</style>
