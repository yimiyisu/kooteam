<template>
    <z-dialog class="k-thing-detail-bg" :visible.sync="isShow" v-if="item">
        <div class="dialog-header">
            <z-button plain round size="mini" v-show="item.status === 0" @click.stop="doFinish"><i
                    class="z-icon">&#xe5ca;</i>标记完成
            </z-button>
            <z-button plain round size="mini" v-show="item.status === 1" @click.stop="doFinish"><i
                    class="z-icon">&#xe5cd;</i>标记未完成
            </z-button>
            <z-button plain round size="mini" v-show="item.status === 2" @click.stop="doFinish"><i
                    class="z-icon">&#xe042;</i>撤销删除
            </z-button>
            <z-button plain round size="mini" @click.stop="save"><i class="z-icon">&#xe161;</i>保存</z-button>
        </div>
        <div class="dialog-content" @click="click">
            <div class="editor-content">
                <z-input maxlength="60" class="title" type="text" v-model="item.title"></z-input>
                <textarea id="J_Editor" :value="item.content" name="content" class="hide"></textarea>
            </div>
            <div class="form">
                <dl class="z-left">
                    <dt>
                        <i class="z-icon">&#xe916;</i>计划日期
                    </dt>
                    <dd>
                        <Plan v-model="item"></Plan>
                    </dd>
                </dl>
                <dl class="z-left">
                    <dt><i class="z-icon">&#xe7fc;</i>负责人:</dt>
                    <dd>
                        <Owner v-model="item" :nick="onwerNick" @changeUser="showUser"></Owner>
                        <k-user-search v-if="showUserSearch" fixed="true" my="true"
                                       v-model="owner"></k-user-search>
                    </dd>
                </dl>
                <dl class="z-left" v-if="!quadrant">
                    <dt><i class="z-icon">&#xe228;</i>优先级</dt>
                    <dd>
                        <Priority v-model="item"></Priority>
                    </dd>
                </dl>
                <dl class="z-left" style="width: 98%">
                    <dt style="line-height: 32px">
                        <i class="z-icon">&#xe190;</i>提醒设置
                    </dt>
                    <dd>
                        <Clock v-model="item"></Clock>
                    </dd>
                </dl>
                <Comment v-model="item"></Comment>
            </div>
            <CommentPost :item="item"></CommentPost>
        </div>
    </z-dialog>
</template>
<script>
    import Comment from "./detail/comment"
    import Describe from "./detail/describe"
    import Owner from "./detail/owner"
    import SubThing from "./detail/subThing"
    import Plan from "./detail/plan"
    import Tag from "./detail/tag"
    import Priority from "./detail/priority"
    import CommentPost from "./detail/commentPost"
    import Clock from "./detail/clock"
    import Config from '../util/config'

    export default {
        props: ["quadrant"],
        data: function () {
            return {
                item: null,
                showUserSearch: false,
                onwerNick: "",
                owner: {},
                isShow: false
            }
        },
        components: {Comment, Describe, Owner, SubThing, Tag, Plan, Priority, CommentPost, Clock},
        mounted: function () {
            $.lib(["/tinymce/tinymce.min.js"]);
            this.$nextTick(function () {
                $.on("thingDetail", this.init);
            });
        },
        watch: {
            owner: function (val) {
                this.onwerNick = val.nick;
                this.item.owner = val.uid;
            }
        },
        methods: {
            editorFunc() {
                let that = this;
                let uploadURL = Config.uploadDomain() + "/upload/image.do";
                tinymce.init({
                    selector: "#J_Editor",
                    height: 200,
                    statusbar: false,
                    menubar: false,
                    language: 'zh_CN',
                    body_class: "article-body",
                    images_upload_url: uploadURL,
                    automatic_uploads: false,
                    plugins: [
                        'advlist autolink lists link image charmap emoticons anchor',
                        'searchreplace visualblocks',
                        'insertdatetime media table paste'
                    ],
                    toolbar: 'undo redo | bold italic backcolor | alignleft aligncenter alignright alignjustify  | removeformat',
                    content_css: ["//a.yimiyisu.com/zeto/lib/zetoui.css"]
                }).then(function (editors) {
                    that.editor = editors[0];
                    // 加载默认模版
                });
            },
            init: function (id) {
                $.http({_id: id}, "/thing/get.do", function (reback) {
                    this.item = reback.data;
                    this.isShow = true;
                    setTimeout(() => {
                        this.editorFunc()
                    }, 500);
                }, this);
            },
            close: function () {
                this.isShow = false;
                // location.reload();    // 重新加载主页面，可以刷新修改
            },
            showUser(val) {
                this.showUserSearch = val;
            },
            click() {
                if (this.showUserSearch) {
                    this.showUserSearch = false;
                }
            },
            preventEvt: function (evt) {
                evt.stopPropagation();
            },
            doFinish: function () {
                let tempStatus = this.item.status,
                    id = this.item._id, status;
                if (tempStatus === 1) {
                    status = 0;
                }
                if (tempStatus === 0 || tempStatus === 2) {
                    status = 1;
                }
                $.http({"_id": id, "status": status}, "/thing/patch.do", function (reback) {
                    this.item["status"] = status;
                }, this);
            },
            delTodo: function () {
                $.http({"_id": this.item._id, "status": 2}, "/thing/patch.do", function (reback) {
                    this.item["status"] = 2;
                }, this);
            },
            save: function () {
                $.http(this.item, "/thing/patch.do", function (reback) {
                    this.isShow = false;
                    $.emit("thingUpdate", this.item);
                }, this)
            }
        }
    }
</script>