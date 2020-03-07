<template>
    <z-button plain size="small" @click="show">
        <slot></slot>
        <z-dialog class="k-repository-set" size="small" title="知识库权限设置" @close="close" v-if="isShow" visible>
            <z-form>
                <z-radio label="阅读权限" @change="change" v-model="def">
                    <var value="1">私有文库</var>
                    <var value="3">同事开放</var>
                    <var value="2">完全开放</var>
                </z-radio>
                <z-field label="用户列表">
                    <z-employee :max="1" popover @finish="addUser">
                        <z-button plain>添加用户</z-button>
                    </z-employee>
                    <div class="user" v-for="uid in users" :key="uid">
                        <z-nick :uid="uid"></z-nick>
                        <i class="ft icon hover" @click="remove(uid)">&#xe6c2;</i>
                    </div>
                </z-field>
            </z-form>
        </z-dialog>
    </z-button>
</template>
<script>
    export default {
        props: ['note', 'permision'],
        data: function () {
            return {
                def: '1',
                users: [],
                current: {},
                searchTag: false,
                isShow: false
            };
        },
        created() {
            this.def = this.$parent.data.permision;
        },
        methods: {
            change(val) {
                let param = {
                    _id: this.note,
                    permision: val
                };
                $.post(param, '/note/patch.do', function (reback) {
                    this.$parent.data.permision = param.permision;
                }, this);
            },
            show() {
                this.isShow = true;
                this.loadData();
            },
            addUser(uid) {
                let param = {
                    noteId: this.note,
                    permision: 2,
                    uid: uid
                };
                if (!param.uid) {
                    return;
                }
                $.post(param, '/note/addUser.do', function (reback) {
                    this.users.unshift(param.uid);
                }, this);
            },
            remove(uid) {
                $.get({uid: uid, noteId: this.note}, '/note/removeUser.do', _ => {
                    this.users.forEach((current, idx) => {
                        if (current === uid) {
                            this.users.splice(idx, 1);
                        }
                    })
                });
            },
            close: function () {
                this.isShow = false;
            },
            loadData: function () {
                $.get(
                    {noteId: this.note},
                    '/select/noteUser.json',
                    function (reback) {
                        let data = reback.data;
                        if (!data) {
                            return;
                        }
                        data.forEach((user) => {
                            this.users.push(user.uid);
                        });
                    },
                    this
                );
            }
        }
    };
</script>