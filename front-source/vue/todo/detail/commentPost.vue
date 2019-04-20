<template>
    <div class="k-comment-post">
        <!--<label><i class="z-icon" v-tip="'添加文档'">&#xe2bc;</i></label>-->
        <!--<label><i class="z-icon" v-tip="'上传附件'">&#xe864;</i></label>-->
        <input placeholder="按回车健发送评论" v-model="text" type="text" class="input" @keyup.enter="submitComment"/>
    </div>
</template>
<script>
    export default {
        props: ["item"],
        data: function () {
            return {
                text: "",
                placeholder: "按回车健发送评论",
                isInput: true,
            }
        }, methods: {
            submitComment: function () {
                let parmas = {targetId: this.item._id, content: this.text, status: 1};
                $.http(parmas, "/put/comment.json", function () {
                    this.text = "";
                    $.emit("addNewComent", null);  //重新加载评论
                }, this);
            },
        }
    }
</script>