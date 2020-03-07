<template>
    <ul class="z-left category">
        <li><a href="/app/home.xhtm">日</a></li>
        <li @click="click('agenda')" :class="{'active':type==='agendaWeek'}">周</li>
        <li @click="click('agendaWeek')" :class="{'active':type==='agenda'}">月</li>
    </ul>
</template>
<script>
    export default {
        data: function () {
            return {
                type: ""
            }
        },
        mounted: function () {
            this.type = $.getParam("type");
        },
        methods: {
            click: function (type) {
                this.type = type;
                $.emit("c_switch", type);
            }
        }
    }
</script>