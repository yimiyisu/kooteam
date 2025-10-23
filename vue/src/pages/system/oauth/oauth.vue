<template>
    <z-table name="37fizkr9" @rsync="rsync">
        <template #accessKey="{ row }">
            <z-copy :label="row.accessKey" :value="'accessKey=' + row.accessKey + '\nsecretKey=' + row.secretKey">
                <z-icon value="copy" />
            </z-copy>
        </template>
    </z-table>
</template>

<script>
import configs from './.lowcode/configs';

export default {
    name: 'p-37fizkr9',
    provide: { configs },
    data() {
        return {}
    },
    methods: {
        rsync() {
            $.get({ url: '/api/system/rsyncOAuth' })
        }
    },
}
</script>
