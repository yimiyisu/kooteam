<template>
    <z-form label-width="90px" style="width:380px">
        <z-input label="用户名" v-model="user"></z-input>
        <z-input label="登录密码" @keyup.native.enter="submit" show-password v-model="pwd"></z-input>
        <z-field>
            <z-button type="primary" @click="submit">提交</z-button>
        </z-field>
    </z-form>
</template>
<script>
    export default {
        props: ['value', 'target'],
        data: function () {
            return {
                user: '',
                pwd: ''
            };
        },
        methods: {
            keyup(e) {
                debugger;
            },
            submit() {
                let target = '/zeto/login.do';
                if (this.value && this.value.type === "ladp") {
                    target = '/home/ladp.do';
                }
                $.post({
                    username: this.user,
                    password: this.pwd,
                    redirect: '/todo/home.xhtm'
                }, target);
            }
        }
    };
</script>