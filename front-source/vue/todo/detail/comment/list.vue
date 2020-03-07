<template>
    <div>
        <div v-if="comments.length===0" class="empty">
            <i class="ft icon h1">&#xe78f;</i>暂无评论
        </div>
        <z-row v-for="(item,index) in comments" class="content" :key="item._id">
            <z-col :span="2">
                <z-avator class="avator" :uid="item.uid"></z-avator>
            </z-col>
            <z-col :span="22">
                <z-row class="info">
                    <z-col :span="18">
                        <z-nick class="nick" :uid="item.uid"></z-nick>
                        {{item._id|idate}}
                    </z-col>
                    <z-col :span="6">
                        <z-confirm class="ft red hover"
                                   @click="remove(item._id,index)"
                                   v-if="isOnwer|| item.uid===item.uid">删除
                        </z-confirm>
                    </z-col>
                </z-row>
                {{item.content}}
            </z-col>
        </z-row>
        <div class="post">
            <!--<label><i class="ft icon">&#xe701;</i></label>-->
            <!--<label><i class="ft icon">&#xe87a;</i></label>-->
            <input placeholder="按回车健发送评论" v-model="text" type="text" class="input" @keyup.enter="submit"/>
        </div>
    </div>

</template>
<script>
    export default {
        data() {
            return {
                comments: [],
                text: "",
                isOnwer: false,
                thingId: ""
            }
        },
        inject: ["log", "getThing"],
        mounted() {
            let thing = this.getThing();
            this.isOnwer = thing.owner === zen.user.id;
            this.thingId = thing._id;
            $.post({targetId: this.thingId}, "/comment/selectByParent.do", function (reback) {
                let data = reback.data;
                if (data) {
                    this.comments = data;
                }
            }, this);
        },
        methods: {
            remove(id, index) {
                $.post({_id: id, status: 0}, "/patch/comment.json", function () {
                    this.comments.splice(index, 1);
                }, this);
            },
            submit: function () {
                let content = this.text;
                if (!content) {
                    return $.notice("请输入评论内容", "error");
                }
                let parmas = {targetId: this.thingId, content: content, status: 1};
                $.post(parmas, "/put/comment.json", function (reback) {
                    this.text = "";
                    this.comments.unshift(reback.data);
                }, this);
            }
        }
    }
</script>