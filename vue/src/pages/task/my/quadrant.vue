<template>
    <el-col :md="12">
        <div :class="[data.tag]">
            <Title :data="data" @finish="finish" />
            <el-scrollbar height="45vh">
                <z-drag-drop :name="data.value" ref="drag" :value="data.sons" class="wrap" @done="update"
                    empty="恭喜你！已完成了所有待办" group="quadrant">
                    <template #default="item">
                        <a-thing @refresh="refresh" :data="item" :now="now" />
                    </template>
                </z-drag-drop>
            </el-scrollbar>
        </div>
    </el-col>
</template>
<script>
import Title from "./title";
const span = 2000
export default {
    components: { Title },
    props: {
        data: Object,
        now: Number,
    },
    data() {
        return {
            currentId: "",
        };
    },
    methods: {
        finish(item) {
            this.$refs['drag'].push(item)
        },
        // 更新拖拽后的数据状态
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
                quadrant: target,
                order,
            }
            $.post({ data, url: "/do/patch/thing" })
        },
        refresh() {
            this.$emit('refresh')
        },
    },
};
</script>
<style lang="scss" scoped>
:deep(.empty) {
    margin-top: 30px;
    text-align: center;
    color: #666;
    font-size: 14px;
}

.a,
.b,
.c,
.d {
    padding: 6px 14px;
}

.a,
.b {
    border-bottom: solid 2px var(--a-border-color-extra-light);
}

.a,
.c {
    border-right: solid 2px var(--a-border-color-extra-light);
}

.k-thing {
    border-bottom: 1px dotted var(--a-border-color-light);
    line-height: 38px;
    height: 38px;
}

.wrap {
    min-height: 60%;
}
</style>
