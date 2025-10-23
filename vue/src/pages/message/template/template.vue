<template>
    <z-table name="13ans150" :entitys="entitys">
        <template #messageSend="data">
            <messageSend :data="data"/>
        </template>
    </z-table>
</template>

<script>
import configs from './.lowcode/configs';
import messageSend from './blocks/messageSend.vue';
export default {
    name: 'p-13ans150',
    provide: { configs },
    components:{messageSend},
    data() {
        return {
            entitys: {
                channels: {
                    type: 'table',
                    fields: [
                        { label: '渠道选择', name: 'channel', type: "search", depend:"message_channel"},
                    ],
                },
            }
        }
    },
}
</script>
