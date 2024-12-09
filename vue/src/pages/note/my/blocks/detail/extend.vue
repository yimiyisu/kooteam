<template>
    <el-collapse-transition>
        <div :class="['extend', { min: !expansion }]">
            <h3 @click="toggle"><z-icon :value="expansion ? 'chevronsDown' : 'chevronsUp'" />目录外的</h3>
            <z-block v-if="loaded" v-show="expansion" :params="params" url="/do/list/note_content">
                <template #default="list">
                    <el-empty v-if="!list || list.length === 0" description="暂无数据" style="--a-empty-padding:10px" />
                    <div v-for="item in list" :key="item.id" class="item">
                        <div class="title" @click="open(item)">{{ item.title }}</div>
                        <div class="action">
                            <z-action link title="确定恢复到目录中吗？" :data="{ ...item, type: 8 }"
                                url="/do/patch/noteContentStatus" @finish="restore" icon="cornerUpLeft" />
                            <z-action link title="确定彻底删除吗？" :data="item" url="/do/delete/note_content" icon="trash2" />
                        </div>
                    </div>
                </template>
            </z-block>
        </div>
    </el-collapse-transition>
</template>
<script>
export default {
    props: {
        noteId: String,
        randId: null
    },
    data() {
        return {
            loaded: false,
            expansion: false
        }
    },
    computed: {
        params() {
            const { noteId, randId } = this
            return { noteId, randId }
        }
    },
    methods: {
        restore(data, formData) {
            this.$emit('restore', formData)
        },
        toggle() {
            this.expansion = !this.expansion
            this.loaded = true
        },
        open(item) {
            this.$emit('open', item)
        }
    },
}
</script>
<style lang="scss" scoped>
.extend {
    position: absolute;
    background: var(--a-fill-color-extra-light);
    bottom: 0;
    left: 0;
    right: 0;

    .z-block {
        max-height: 260px;
        overflow: auto;
    }

    &.min .z-block {
        display: none;
    }


    h3 {
        margin: 0;
        cursor: pointer;
        background: var(--a-fill-color);
        padding-left: 12px;
        line-height: 30px;
    }
}

.item {
    line-height: 30px;
    display: flex;
    margin: 0 12px 6px 12px;
    border-top: 1px solid var(--a-border-color-lighter);

    &:hover .action {
        visibility: visible;
    }

    .title {
        height: 30px;
        cursor: pointer;
        text-overflow: ellipsis;
        flex: 1
    }

    .action {
        width: 60px;
        visibility: hidden;
    }
}
</style>