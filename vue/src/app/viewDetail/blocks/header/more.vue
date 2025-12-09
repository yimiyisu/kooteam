<template>
    <el-row>
        <el-col :span="1">
            <z-icon value="user" />
        </el-col>
        <el-col :span="5">
            状态：
            <z-dict code="thingStatus" type="text" v-model="value.status" :readonly="true" />
        </el-col>
        <el-col :span="8">
            优先级：
            <z-dict code="quadrantType" type="text" v-model="value.quadrant" :readonly="true" />
        </el-col>
        <el-col :span="10">
            <!-- readonly没起作用 -->
            负责人：<z-user v-model="value.owner" readonly />
        </el-col>
    </el-row>
</template>
<script>
export default {
    props: {
        value: Object
    },
};
</script>

