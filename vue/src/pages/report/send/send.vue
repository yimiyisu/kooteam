<template>
    <z-table name="oezdwauakls" :beforeSubmit="beforeSubmit">
        <template #recieversSlot="data">
            <a-users label="抄送人" :value="data" name="recievers" />
        </template>
        <template #groupSlot="data">
            <Group :value="data" />
        </template>
        <template #editorSlot="data">
            <Editor :data="data" />
        </template>
    </z-table>
</template>

<script>
import configs from './.lowcode/configs';
import Editor from './blocks/editor.vue';
import Group from './blocks/group.vue';

export default {
    name: 'p-oezdwauakls',
    components: { Group, Editor },
    provide: { configs },
    data() {
        return {
        }
    },
    methods: {
        beforeSubmit(formData) {
            if (!formData.timer) {
                formData.timer = 0
            }
        }
    }
}
</script>