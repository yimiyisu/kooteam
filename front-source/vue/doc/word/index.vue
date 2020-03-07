<template>
    <div v-show="!readonly" class="k-rich">
        <z-editor :value="value" @input="save" mode="full"></z-editor>
    </div>
</template>
<script>
    // <Rich :readonly="readonly" :value="item" :emitSave="emitSave"></Rich>
    export default {
        props: ['readonly', 'value'],
        methods: {
            save: function (content) {
                this.$parent.updateContent(content);
            }
        }
    };
</script>