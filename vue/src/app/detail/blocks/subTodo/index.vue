<template>
    <el-row>
        <el-col :span="1">
            <z-icon value="gitMerge" />
        </el-col>
        <el-col :span="23">
            <strong>子任务列表</strong>
            <z-action mode="popover" v-if="!archived" url="/do/put/thing" :beforeSubmit="beforeAdd" @finish="addFinish"
                :fields="fields" width="540px" size="small" class="right" label="添加子任务" />
            <el-progress v-if="list && list.length > 0" status="success" :percentage="percent" />
            <div class="empty" v-else>暂无子任务</div>
            <Thing v-for="(item) in list" :fields="fields" :key="item.id" :value="item" />
        </el-col>
    </el-row>
</template>
<script>
import Thing from "./thing";
export default {
    inject: ["log"],
    components: { Thing },
    props: {
        value: Object,
        list: Array,
        archived: Boolean
    },
    data() {
        return {
            fields: [
                { name: 'title', label: '任务标题' },
                { name: 'quadrant', label: '优先级', code: 'quadrantType' },
                { name: 'owner', label: '负责人', type: 'user' }
            ]
        }
    },
    computed: {
        percent() {
            let length = this.list.length,
                number = 0;
            this.list.forEach((item) => item.status && number++);
            if (length === 0) {
                return 0;
            }
            number = parseInt((number / length) * 100);
            return number;
        },
    },
    methods: {
        beforeAdd(formData) {
            if (!formData.title) {
                $.error("任务名称不能为空")
                return false
            }
            const { value } = this
            const result = { ...value, parentId: value.id }
            Object.keys(formData).forEach((key) => formData[key] && (result[key] = formData[key]))
            return result
        },
        addFinish(result, formData) {
            this.log("添加子任务:" + formData.title, 4);
            $.emit('thingUpdate', 1)
        }
    },
};
</script>
<style lang="scss" scoped>
.empty,
.a-progress {
    margin: 15px 0 10px 0;
}


.a-row {
    padding-top: 20px;

    :deep(.right) {
        position: absolute;
        top: 16px;
        right: 0;
    }
}
</style>
