<template>
    <z-block url="/do/list/thingLatest" :params="params" :resources="resources">
        <template #default="things">
            <Board :things="things" />
        </template>
    </z-block>
</template>
<script>
import Board from './blocks/board.vue';

export default {
    components: { Board },
    data() {
        return {
            params: { pageSize: 200 },
            resources: ['lib/fullcalendar/index.global.min.js'],
        };
    },
};
</script>
<style lang="scss">
@use "./blocks/style.scss";
</style>
