<template>
    <z-table name="cw0h1cynj1k">
        <template #weekId="{ row }">
            <z-text @click="show(row)" class="hover" :modelValue="row.weekId" depend="week" />
        </template>
    </z-table>
    <z-action ref="action" title="周报详情" width="1000px">
        <Detail :week="week" />
    </z-action>
</template>

<script>
import configs from './.lowcode/configs';
import Detail from './blocks/detail.vue';

export default {
    name: 'p-cw0h1cynj1k',
    components: { Detail },
    provide: { configs },
    data() {
        return {
            week: null
        }
    },
    methods: {
        show(row) {
            this.week = row
            this.$refs['action'].show()
        }
    }
}
</script>