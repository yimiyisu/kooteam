<template>
    <el-row style="margin-top:12px">
        <el-col :span="1"><z-icon value="users" /> </el-col>
        <el-col :span="23">
            关注的人：
            <span class="user" v-for="(uid, idx) in list" :key="uid">
                <z-avatar :value="uid" />
                <z-icon value="x" class="hover" @click="remove(idx)" />
            </span>
            <z-user v-model="current" placeholder="点击添加关注人" @change="change" />
        </el-col>
    </el-row>
</template>
<script>
export default {
    inject: ["log"],
    name: "detailFollw",
    props: { value: Object },
    data() {
        return {
            list: null,
        };
    },
    created() {
        this.list = this.value.watchers || []
    },
    methods: {
        change(val) {
            if (!this.list.includes(val)) {
                this.list.unshift(val)
                this.save()
            }
            this.current = null
        },
        remove(idx) {
            this.list.splice(idx, 1)
            this.save()
        },
        async save() {
            const { value, list } = this;
            value.watchers = list
            await $.post({ url: '/do/patch/thing', data: value })
            this.log("添加关注人")
        }
    },
};
</script>
<style lang="scss" scoped>
.user {
    padding-right: 12px;
    display: inline-block;
    position: relative;

    .hover {
        display: none;
        position: absolute;
        right: 0;
        top: 0
    }

    :deep(.z-avatar) {
        margin-bottom: -8px;
    }

    &:hover .hover {
        display: block;
    }
}
</style>