<template>
    <div class="content">
        <Thing v-for="item in value" :now="now" :key="item._id" :data="item"></Thing>
    </div>
</template>
<script>
    import Thing from "../../todo/thing"

    export default {
        props: ["value"],
        components: {Thing},
        data: function () {
            return {
                list: [],
                now: 0
            }
        }, created: function () {
            let date = new Date();
            this.now = date.getTime() % 1000;
        }
    }
</script>