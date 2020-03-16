<template>
    <div v-show="!readonly" class="k-rich">
        <z-editor :value="value" :="upload" @input="save" mode="full"></z-editor>
    </div>
</template>
<script>
    // <Rich :readonly="readonly" :value="item" :emitSave="emitSave"></Rich>
    export default {
        props: ['readonly', 'value'],
        data() {
            return {
                upload: null
            }
        },
        methods: {
            save(content) {
                this.$parent.updateContent(content);
            }
        }
    };
</script>