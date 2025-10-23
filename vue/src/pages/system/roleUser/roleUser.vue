<template>
    <z-table name="5r51yvl6" @refresh="refresh">
    </z-table>
</template>

<script>
import configs from './.lowcode/configs';

export default {
    name: 'p-5r51yvl6',
    provide: { configs },
    inject: ['points'],
    data() {
        return {}
    },
    methods: {
        refresh(result, formData) {
            $.post({ url: '/api/user/refresh', data: formData })
        }
    },
}
</script>
