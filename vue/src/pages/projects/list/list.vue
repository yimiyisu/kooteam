<template>
    <z-table name="o942b345r8y">
        <template #default="{ row }">
            <Card :value="row" />
        </template>
    </z-table>
    <Detail />
</template>

<script>
import configs from './.lowcode/configs';
import Card from './blocks/card.vue';
import Detail from './blocks/detail/index.vue';

export default {
    name: 'p-o942b345r8y',
    components: { Card, Detail },
    provide: { configs },
    data() {
        return {}
    },
}
</script>