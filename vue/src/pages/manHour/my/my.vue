<template>
    <z-page-title value="工时填报" />
    <z-block url="/do/list/manhour_my" :params="params" :resources="resources">
        <template #default="things">
            <Board :things="things" />
        </template>
    </z-block>
</template>

<script>
import Board from './blocks/board.vue';

export default {
    inheritAttrs: false,
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
