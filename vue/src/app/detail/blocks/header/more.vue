<template>
    <el-row>
        <el-col :span="1">
            <z-icon value="user" />
        </el-col>
        <el-col :span="5">
            状态：
            <z-dict code="thingStatus" type="text" v-model="value.status" @change="() => change('thingStatus')" />
        </el-col>
        <el-col :span="8">
            优先级：
            <z-dict code="quadrantType" type="text" v-model="value.quadrant" @change="() => change('quadrantType')" />
        </el-col>
        <el-col :span="10">
            负责人：<z-user v-model="value.owner" @change="() => change('owner')" />
        </el-col>
    </el-row>
</template>
<script>
export default {
    inject: ['log', '$dict'],
    props: {
        value: Object,
        readonly: Boolean
    },
    data() {
        return {
            quadrant: null
        }
    },
    created() {
        this.quadrant = this.value.quadrant
    },
    methods: {
        async change(type) {
            const { value, readonly } = this
            if (readonly) {
                return
            }
            await $.post({ url: '/do/patch/thing', data: value })
            let message;
            let logType;
            if (type === 'owner') {
                message = "修改责任人为：" + $.nick(value.owner)
                logType = 1
            } else if (type === 'thingStatus') {
                console.log(this.$dict(type))
                const dict = this.$dict(type).v.find(item => item.value === value.status)
                message = '修改状态为：' + dict.label
                logType = 2
            } else {
                const dict = this.$dict(type).v.find(item => item.value === value.quadrant)
                message = '调整优先级为：' + dict.label
            }
            this.log(message, logType)
            $.emit("thingUpdate", value, this.quadrant);
        }
    },
}
</script>