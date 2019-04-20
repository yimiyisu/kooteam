<template>
    <z-form label-width="100px">
        <z-field label="用户名">
            <z-input v-model="user"></z-input>
        </z-field>
        <z-field label="登录密码">
            <z-input show-password v-model="pwd"></z-input>
        </z-field>
        <z-field>
            <z-button type="primary" @click="submit">提交</z-button>
        </z-field>
    </z-form>
</template>
<script>

    export default {
        props: ["value", "target"],
        data: function () {
            return {
                user: "",
                pwd: ""
            }
        },
        mounted: function () {
            //区分普通账户登陆与ladp账户登陆
        },
        methods: {
            submit: function () {
                $.http({user: this.user, pwd: this.pwd}, "/login/checkPwd.do", function (reback) {
                    if (reback.hasError) {
                        return;
                    }
                    window.location = this.target;
                }, this);
            }
        }
    }
</script>