<template>
    <NodeViewWrapper>
        <z-block url="/do/get/thing" :params="{ id: attrs.thingId }">
            <template #default="result">
                <Thing :value="result" />
            </template>
        </z-block>
    </NodeViewWrapper>
</template>
<script>
import Thing from './thing.vue';
import { defineComponent, toRefs, computed } from 'vue';

export default defineComponent({
    components: { Thing },
    props: Object,
    setup(props) {
        const { node } = toRefs(props)
        const attrs = computed(() => node.value.attrs)
        return {
            attrs,
        }
    },
})
</script>
