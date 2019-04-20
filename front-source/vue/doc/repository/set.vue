<template>
    <z-dialog class="k-repository-set" title="知识库权限设置" :visible.sync="isShow">
        <z-form label-width="100px;">
            <z-field label="阅读权限">
                <z-radio v-model="def">
                    <var value="1">私有文库</var>
                    <var value="3">同事开放</var>
                    <var value="2">完全开放</var>
                </z-radio>
            </z-field>
            <z-field label="编辑人员">
                <z-button type="primary" size="small" @click="showSearch">添加用户</z-button>
                <div v-show="searchTag" class="search">
                    <k-user-search v-model="current"></k-user-search>
                    <div class="action">
                        <z-button size="small" @click="cancel">取消</z-button>
                        <z-button size="small" type="primary" @click="select">确定</z-button>
                    </div>
                </div>
            </z-field>
            <z-field>
                <div class="user" v-for="user in users" :key="user._id">
                    <z-avator :uid="user._id"></z-avator>
                    <strong>{{user.nick}}</strong>
                    <span @click="remove(user)" class="z-icon hover">&#xe5c9;</span>
                </div>
            </z-field>
        </z-form>
    </z-dialog>
</template>
<script>
    export default {
        props: ["note", "permision"],
        data: function () {
            return {
                def: "1",
                users: [],
                current: {},
                searchTag: false,
                isShow: false,
            }
        },
        watch: {
            def: function () {
                let param = {
                    _id: this.note,
                    permision: this.def
                };
                $.http(param, "/note/patch.do", function (reback) {
                    this.$parent.chapterData.public = param.permision;
                }, this);
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                $.on("docSet", this.show);
            });
        },
        methods: {
            show(opt) {
                this.isShow = opt;
                this.def = this.permision;
                this.loadData();
            },
            cancel: function () {
                this.searchTag = false;
            },
            select: function () {
                let param = {
                    noteId: this.note,
                    permision: 2,
                    uid: this.current.uid
                };
                if (!param.uid) {
                    return;
                }
                $.http(param, "/note/addUser.do", function (reback) {
                    this.searchTag = false;
                    this.loadData();
                }, this);
            },
            showSearch: function () {
                this.searchTag = true;
            },
            close: function () {
                this.$parent.showSet = false;
            },
            remove: function (user) {
                $.http({_id: user._id, noteId: this.note}, "/note/removeUser.do", function (reback) {
                    this.loadData();
                }, this);
            },
            loadData: function () {
                $.http({noteId: this.note}, "/note/users.do", function (reback) {
                    this.users = reback.data;
                }, this);
            }
        }
    }
</script>