<!--添加成员页面   可被删除-->
<template>
    <div class="k-todo-owner">
        <span class="nick" @click.stop="show">{{name}}</span>
    </div>
</template>
<script>
    export default {
        props: ["value", "nick"],
        data: function () {
            return {
                name: ""
            }
        },
        watch: {
            nick: function (val) {
                if (val) {
                    this.name = val;
                }
            }
        },
        mounted: function () {
            let owner = this.value.owner;
            if (owner === zen.user.id) {
                return this.name = "我自己";
            }
            $.http({uid: owner}, "/user/getById.do", function (reback) {
                this.name = reback.data.nick;
            }, this);
        },
        methods: {
            show: function () {
                this.$emit('changeUser', true);
            }
        }
    }
</script>