<template>
    <div class="main">
        <div class="content">
            <z-block url="/do/get/note_content" :params="params">
                <template #default="result">
                    <h3 class="title2">
                        {{ result.title }}
                    </h3>
                    <div v-if="result.type === 1" v-html="result.content"></div>
                    <Other v-else :data="result" :key="result.id" />
                </template>
            </z-block>
        </div>
    </div>
</template>
<script>
import Other from './detail/other.vue';
export default {
    components: { Other },
    computed: {
        params() {
            return { id: this.$route.params.id }
        }
    },
}
</script>
<style lang="scss" scoped>
.main {
    background: var(--a-bg-color);
    position: relative;
    max-width: 1200px;
    margin: 20px auto;
}

.tool {
    position: absolute;
    top: 10px;
    right: 12px;
    color: var(--a-text-color-placeholder);
}

.title2 {
    margin: 0;
    font-size: 2em;
    color: var(--a-text-color-primary);
}
</style>