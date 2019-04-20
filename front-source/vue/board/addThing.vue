<template>
    <div class="k-board-add">
        <textarea type="text" maxlength="60" v-model="title" placeholder="请输入要处理的任务"></textarea>
        <div class="owner">负责人：
            <div class="avator" @click.stop="userShow">
                <z-avator :uid="uid"></z-avator>
                <span>{{nick}}</span>
            </div>
            <k-user-search @blur="userBlur" my="true" v-model="owner" v-if="isShow"></k-user-search>
        </div>
        <div class="prority">
            <span class="title">优先级：</span>
            <label v-for="item in prorityData" @click="select(item,$event)"
                   :class="'k-prority '+item.key"></label>
        </div>
        <div class="btns">
            <z-button plain size="mini" @click="close">取消</z-button>
            <z-button plain type="primary" size="mini" @click="save">保存</z-button>
        </div>
    </div>
</template>
<script>

    import prorityData from "../common/prority"

    export default {
        props: ["data"],
        data: function () {
            return {
                title: "",
                owner: null,
                uid: "",
                nick: "",
                prority: "",
                prorityData: prorityData,
                isShow: false
            }
        },
        watch: {
            owner: function (val) {
                this.nick = val.nick;
                this.uid = val.userId;
                this.isShow = false;
            }
        },
        mounted: function () {
            this.nick = "我自己";
            this.uid = zen.user.id;
            this.$parent.$parent.$on("hideUserSearch", this.userBlur);
        },
        methods: {
            userShow: function () {
                this.isShow = true;
            },
            userBlur: function () {
                if (!this.isShow) {
                    return;
                }
                this.isShow = false;
            },
            select: function (val, evt) {
                if (val.key === this.prority) {
                    return;
                }
                this.prority = val.key;
                $(".k-prority", this.$el).removeClass("active");
                let target = $(evt.currentTarget);
                target.addClass("active");
            },
            save: function () {
                if (!this.title) {
                    return alert("任务内容不能为空");
                }
                let param = {
                    title: this.title,
                    tag: this.data.tag,
                    projectId: $.getParam('id'),
                    quadrant: "b",
                    status: 0,
                };
                if (this.prority) {
                    param.quadrant = this.prority;
                }
                if (this.owner) {
                    param.owner = this.owner.uid;
                }
                $.http(param, "/thing/put.do", function (reback) {
                    let data = reback.data, columns = parent.columns;
                    param._id = data._id;
                    this.$emit('changeCategory', param);
                    this.close();
                }, this);
            },
            close: function () {
                this.$parent.isAddThing = false;
            }
        }
    }
</script>