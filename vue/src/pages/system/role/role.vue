<template>
    <z-table name="n15ayxfj" :params="params">
    </z-table>
</template>

<script>
import configs from './.lowcode/configs';
const params = { app: 'kooteam' }
export default {
    name: 'p-n15ayxfj',
    provide: { configs, $map: params },
    setup() {
        return { params }
    }
}
</script>
