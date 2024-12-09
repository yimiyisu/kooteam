<template>
    <el-form-item :label="label">
        <z-user v-model="current" @change="change" />
        <div class="users">
            <el-tag v-for="(uid, idx) in list" :key="uid" @close="remove(idx)" closable type="primary" effect="plain">
                <z-user :value="uid" />
            </el-tag>
        </div>
    </el-form-item>
</template>
<script>
export default {
    props: {
        label: String,
        value: Object,
        name: String
    },
    data() {
        return {
            list: null,
            current: null
        }
    },
    created() {
        const { value, name } = this;
        if (value) {
            this.list = value[name] || []
        }
    },
    methods: {
        change(val) {
            if (!this.list.includes(val)) {
                this.list.unshift(val)
                this.value[this.name] = this.list
            }
            this.current = null
        },
        remove(idx) {
            this.list.splice(idx, 1)
            this.value[this.name] = this.list
        }
    },
}
</script>
<style lang="scss">
.users {
    width: 100%;

    .a-tag {
        margin-right: 8px;
    }
}
</style>