<template>
    <div class="header">
        <h4>
            {{ column.title }}
        </h4>
        <div class="op">
            <!-- 新增项目详情 -->
            <el-popover :visible="visible" :width="300">
                <AddThing v-if="visible" @update="save" @close="toggle" />
                <template #reference>
                    <z-icon value="plus" size="18" class="hover" @click="toggle" />
                </template>
            </el-popover>
            <!-- <el-dropdown :hide-on-click="false">
                <z-icon size="18" value="moreHorizontal" class="hover" />
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item @click="rename">重命名</el-dropdown-item>
                        <el-dropdown-item>导出卡片</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown> -->
        </div>
    </div>
</template>
<script>
import AddThing from './addThing.vue';
export default {
    components: { AddThing },
    props: {
        column: Object
    },
    data() {
        return { visible: false }
    },
    methods: {
        toggle() {
            this.visible = !this.visible
        },
        save(data) {
            this.$emit('save', data, true)
            this.visible = false;
        },
        rename() {

        }
    },
}
</script>
<style scoped lang="scss">
.header {
    display: flex;
    user-select: none;

    h4 {
        flex: 1;
        font-size: var(--a-font-size-medium);
        height: 30px;
        padding: 0;
        margin: 0;
        overflow: hidden;
    }

    .op {
        width: 50px;

        .a-icon {
            padding: 3px;
        }
    }
}
</style>