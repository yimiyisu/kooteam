<template>
    <Thing :now="now" :data="value"></Thing>
</template>
<script>
    import Thing from "../../todo/thing"

    export default {
        props: ["value"],
        components: {Thing},
        data: function () {
            return {
                now: 0
            }
        },
        created: function () {
            let date = new Date();
            this.now = date.getTime() % 1000;
        }
    }
</script>