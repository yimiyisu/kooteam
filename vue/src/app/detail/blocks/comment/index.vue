<template>
    <div class="comment">
        <div class="title">
            <z-icon value="layers" />
            <strong :class="{ except: isLog }" @click="open"> 评论列表 </strong>
            |
            <strong :class="{ except: !isLog }" @click="close">
                操作记录
            </strong>
        </div>
        <List :value="value" v-show="!isLog" />
        <Log :value="value" v-if="isLog" />
    </div>
</template>
<script>
import List from "./list";
import Log from "./log";
export default {
    name: "detailComment",
    components: { List, Log },
    props: { value: Object },
    data() {
        return {
            isLog: false,
        };
    },
    methods: {
        close() {
            this.isLog = true;
        },
        open() {
            this.isLog = false;
        },
    },
};
</script>
<style lang="scss" scoped>
.title {
    margin-bottom: 6px;
}

strong {
    cursor: pointer;

    &.except {
        color: var(--a-text-color-secondary)
    }
}
</style>
