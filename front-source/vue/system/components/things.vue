<template>
    <div class="content">
        <h5>{{title}}</h5>
        <Thing v-for="item in list" :now="now" :key="item._id" :data="item"></Thing>
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
                now: 0,
                title: ""
            }
        },
        watch: {
            value(val) {
                this.getData();
            }
        },
        created: function () {
            let date = new Date();
            this.now = date.getTime() % 1000;
        },
        mounted() {
            this.getData();
        },
        methods: {
            getData() {
                $.post({type: this.value, id: $.getParam("id")}, '/project/things.do', (reback) => {
                    this.list = reback.data.data;
                    this.title = reback.data.title;
                })
            }
        }
    }
</script>