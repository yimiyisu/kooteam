<template>
    <div class="group">
        <div :class="['item', { selected: current === value.id }]" @click="open(value)" :data-id="value.id">
            <span class="idx">
                {{ idx }}.
            </span>
            {{ value.title }}
            <z-icon v-if="hasSon" size="16px" class="hover" :value="collapse ? 'chevronRight' : 'chevronDown'" />
        </div>
        <div v-if="hasSon" v-show="!collapse">
            <Chapter v-for="(item, index) in value.sons" @open="open" :idx="idx + '.' + (index + 1)" :key="item.id"
                :current="current" :value="item" />
        </div>
    </div>
</template>
<script>
export default {
    name: "Chapter",
    props: {
        idx: Number,
        value: Object,
        current: null
    },
    data() {
        return {
            title: "",
            fields: [{
                label: '文章标题',
                name: 'title'
            }],
            collapse: true
        }
    },
    computed: {
        hasSon() {
            const { sons } = this.value;
            return sons && sons.length > 0
        }
    },
    created() {
        const { value, current } = this
        if (current === value.id) {
            this.open(value)
        }
    },
    methods: {
        open(item) {
            if (item.id === this.value.id) {
                this.collapse = !this.collapse
            }
            this.$emit('open', item)
        },
    }
}
</script>
<style lang="scss" scoped>
.item {
    line-height: 36px;
    height: 36px;
    overflow: hidden;
    text-overflow: ellipsis;
    position: relative;
    padding: 0 50px 0 8px;
    margin-bottom: 1px;

    &.selected {
        color: var(--a-color-primary);
        font-weight: bold;
    }

    &:hover {
        color: var(--a-color-primary);
    }
}

.idx {
    margin-right: 3px;
    font-weight: bold;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
}

.group {
    cursor: pointer;
    border-left: 1px solid transparent;

    .group {
        padding-left: 34px;
    }
}
</style>