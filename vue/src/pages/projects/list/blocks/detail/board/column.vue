<template>
    <div class="column" :data-id="data.id">
        <Title :column="data" @save="save" />
        <el-scrollbar>
            <z-drag-drop :name="data.id" ref="drag" :value="data.sons" class="wrap" @done="update" group="project">
                <template #default="item">
                    <div class="item">
                        <a-thing :key="item.id" :now="now" quadrantable :data="item" />
                        <div class="users">
                            <z-avatar size="14px" :value="item.owner" />
                            <z-avatar size="14px" v-for="watcher in item.watchers" :key="watcher" :value="watcher" />
                        </div>
                    </div>
                </template>
            </z-drag-drop>
        </el-scrollbar>
    </div>
</template>
<script>
import Title from "./title";

const span = 2000
export default {
    components: { Title },
    props: {
        data: Object,
        now: Number,
        projectId: String
    },
    methods: {
        update({ item, target, position, result }) {
            // 计算新数组中的位置
            let order;
            // 移到第一个
            if (position === 0) {
                if (result.length > 1) {
                    order = result[1].order + span
                } else {
                    order = item.order
                }
                // 移到最后一个
            } else if (position === result.length - 1) {
                order = result[position - 2] - span
            } else {
                order = parseInt((result[position - 1].order + result[position + 1].order) / 2)
            }
            const data = {
                id: item.id,
                step: target,
                order,
            }
            $.post({ data, url: "/do/patch/thing" })
        },
        async save(formData, first) {
            const { data, projectId } = this;
            const thing = await $.post({ url: "/do/put/thing", data: { ...formData, step: data.id, projectId } });
            this.addable = false
            console.log(first)
            // if (first) {
            //     return data.sons.unshift(thing)
            // }
            this.$refs['drag'].push(thing)
            // data.sons.push(thing)
        },
    },
};
</script>
<style scoped lang="scss">
.column {
    width: 260px;
    padding: 6px 9px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    border: 1px solid transparent;

    &:hover {
        border-color: var(--a-border-color-lighter);
        background: var(--a-fill-color-extra-light);
    }
}

:deep(.empty) {
    margin: 20px;
    text-align: center;
}

.k-thing {
    padding-bottom: 10px;
}

.item {
    box-shadow: 0 2px 6px rgba(0, 0, 0, .05);
    margin-bottom: 10px;
    padding: 12px;
    cursor: pointer;
    border-radius: 8px;
    border: 1px solid var(--a-border-color-lighter);

    &:hover {
        box-shadow: 0 2px 8px 0 rgba(0, 0, 0, .15);
        background: var(--a-bg-color);
        border-color: var(--a-border-color-light);
    }
}

.users {
    margin-top: 6px;
}

.add {
    text-align: center;
}
</style>
