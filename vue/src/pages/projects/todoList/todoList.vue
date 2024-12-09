<template>
    <z-table name="eooklketvct">
        <template #title="{ row }">
            <a-thing :data="row" />
        </template>
    </z-table>
</template>

<script>
import configs from './.lowcode/configs';

export default {
    name: 'p-eooklketvct',
    provide: { configs },
    data() {
        return {}
    },
}
</script>