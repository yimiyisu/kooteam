<template>
    <span @click="show">
        <slot></slot>
        <z-dialog title="修改标题" width="540px" v-if="visible" @click="close" visible>
            <z-form label-width="100px">
                <z-input label="文档标题" width="340px" type="text" koo="need" v-model="title"></z-input>
            </z-form>
            <div slot="footer" class="dialog-footer">
                <z-button @click="close">取消</z-button>
                <z-button type="primary" @click="update">确定</z-button>
            </div>
        </z-dialog>
    </span>
</template>
<script>
    export default {
        props: ["value"],
        data() {
            return {
                visible: false,
                title: null
            }
        },
        created() {
            this.title = this.value.title;
        },
        methods: {
            show() {
                this.visible = true;
            },
            close() {
                this.visible = false;
            },
            update() {
                let data = {
                    _id: this.value.link || this.value._id,
                    title: this.title
                }, param = {
                    event: "save"
                };
                this.value.title = this.title;
                // 同时需要更新文档里的标题内容
                if (data._id) {
                    $.post(data, "/note/patch.do", function (reback) {
                        $.emit("chapterEvt", param);
                        this.close();
                    }, this);
                }
                $.emit("chapterEvt", param);
            }
        }
    }
</script>