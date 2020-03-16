<template>
    <z-popover width="260"
               class="search" v-model="visible">
        <z-input v-model="keyword" placeholder="请输入关键字搜索"></z-input>
        <div style="text-align: right; margin-top: 10px">
            <z-button size="mini" @click="toggle">取消</z-button>
            <z-button size="mini" type="primary" @click="search">确定</z-button>
        </div>
        <i class="ft icon hover" slot="reference">&#xe7ae;</i>
    </z-popover>
</template>
<script>
    export default {
        data() {
            return {
                keyword: "",
                visible: false
            }
        },
        methods: {
            toggle() {
                this.visible = !this.visible;
            },
            search() {
                this.toggle();
                $.emit("J_docList", "title", this.keyword);
            }
        }
    }
</script>