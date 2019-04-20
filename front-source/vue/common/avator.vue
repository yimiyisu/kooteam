<template>
    <img @error="err" :src="user.uid|avator"/>
</template>
<script>
    export default {
        data: function () {
            return {
                avator: "//img.yimiyisu.com/avator.jpg"
            }
        },
        methods: {
            err: function () {

            }
        }
    }
</script>