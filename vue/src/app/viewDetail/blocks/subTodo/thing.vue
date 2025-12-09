<template>
    <div :class="['k-thing', { finish: value.status === 6 }]">
        <label>
            <z-icon value="checkSquare" v-if="value.status === 6" />
            <z-icon value="square" v-else />
        </label>
        <div class="content">
            <z-icon value="alertCircle" v-if="overtime" />
            {{ value.title }}
        </div>
        <div class="action">
            <z-avatar size="20px" :tip="false" :value="value.owner" />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: Object,
    },
    computed: {
        overtime() {
            let item = this.value;
            if (item.status !== 0 || !item.end) {
                return false;
            }
            let now = new Date();
            now = parseInt(now.getTime() / 1000);
            return item.end < now;
        },
    },
};
</script>
<style lang="scss" scoped>
.k-thing {
    position: relative;
    padding: 6px;
    border-radius: 4px;
}

.content {
    display: inline-block;
}

.action {
    position: absolute;
    text-align: right;
    top: 4px;
    right: 6px;

    :deep(.a-icon) {
        padding-right: 10px;
    }
}
</style>

