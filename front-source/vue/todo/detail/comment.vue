<template>
    <div class="k-thing-comment">
        <div class="header z-row">
            <div class="z-6">
                <i class="z-icon">&#xe53b;</i>动态
            </div>
            <div class="z-18">
                <!--<span class="active">评论</span>-->
                <!--<span>操作记录</span>-->
            </div>
        </div>
        <div v-if="commentsData.length===0" class="empty"><i class="z-icon">&#xe24e;</i>暂无评论</div>
        <div class="comment" v-for="(item,index) in commentsData">
            <div class="header z-row">
                <div class="z-8">{{item.nick}}</div>
                <div class="z-16">
                    <span v-if="myId===item.uid" class="delete" @click="remove(index)">删除</span>
                    <span>{{item._id|idate}}</span>
                </div>
            </div>
            <div class="content">{{item.content}}</div>
            <!--<ul class="attachment">-->
            <!--<li>-->
            <!--Todo+.txt-->
            <!--<span>9.17KB</span>-->
            <!--<i class="z-icon">&#xe313;</i>-->
            <!--</li>-->
            <!--<li>-->
            <!--Todo+.txt-->
            <!--<span>9.17KB</span>-->
            <!--<i class="z-icon">&#xe313;</i>-->
            <!--</li>-->
            <!--</ul>-->
        </div>
    </div>
</template>
<script>
    export default {
        props: ["value"],
        data: function () {
            return {
                commentsData: [],
                targetId: "",
                myId: ""
            }
        },
        mounted: function () {
            if (!this.value) {
                return;
            }
            this.targetId = this.value._id;
            this.queryComments();
            this.myId = zen.user.id;
            $.on("addNewComent", this.addNewComent);
        },
        methods: {
            queryComments: function () {
                let params = {};
                params["targetId"] = this.targetId;
                $.http({targetId: this.targetId}, "/comment/selectByParent.do", function (reback) {
                    let data = reback.data;
                    if (data) {
                        this.commentsData = data;
                    }
                }, this);
            },
            remove: function (index) {
                let tempId = this.commentsData[index]._id;
                this.commentsData.splice(index, 1);
                $.http({_id: tempId, status: 0}, "/patch/comment.json", function () {
                })
            },
            addNewComent: function () {
                this.queryComments();  // 添加完评论以后，重新查询和加载评论
            }
        }
    }
</script>