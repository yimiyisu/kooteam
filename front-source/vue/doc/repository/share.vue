<template>
    <span @click="toggle">
        <slot></slot>
        <z-dialog title="文档链接" width="540px" @close="toggle" v-if="isShow">
            <z-input type="text" :value="url"></z-input>
            <div slot="footer" class="dialog-footer">
                <z-copy :text="url" type="primary">复制链接</z-copy>
            </div>
        </z-dialog>
    </span>
</template>
<script>
    // 新建文档
    export default {
        props: ["itemId"],
        data: function () {
            return {
                isShow: false
            }
        },
        computed: {
            url() {
                return window.location.origin + "/view.html?id=" + this.itemId;
            }
        },
        methods: {
            toggle() {
                this.isShow = !this.isShow;
            }
        }
    }
</script>