<template>
    <z-submit action="/patch/user.json" @finish="finish">保存</z-submit>
</template>
<script>
    export default {
        props: ["value"],
        methods: {
            finish: function (reback) {
                let data = reback.data;
                zen.user.calendar = data.calendar;
                zen.user.home = data.home;
                window.localStorage["config"] = "";
            }
        }
    }
</script>