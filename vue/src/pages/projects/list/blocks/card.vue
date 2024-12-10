<template>
    <div class="a-card is-hover-shadow">
        <div class="title">
            <el-text>
                <z-icon @click="favi" value="star" :style="'--color: var(' + color + ')'" class="hover star" />
                <span @click="detail(value.id)">{{ value.title }}</span>
            </el-text>
        </div>
        <div class="more">
            <div class="left">
                <z-text depend="project_template" :modelValue="value.templateId" />
            </div>
            <div class="right">
                <Quit v-if="value.roleLeft === 1" :projectId="value.id" />
                <Set v-else :value="value" />
            </div>
        </div>
    </div>
</template>
<script>
import Quit from './quit.vue';
import Set from './set.vue';
export default {
    components: { Set, Quit },
    props: {
        value: Object
    },
    computed: {
        color() {
            const { tagLeft } = this.value
            return tagLeft ? '--a-color-primary' : '--a-text-color-placeholder'
        }
    },
    methods: {
        detail(id) {
            $.emit("projectDetail", { id })
        },
        async favi() {
            const { idLeft, tagLeft } = this.value
            const newTag = tagLeft ? 0 : 1
            await $.post({ url: '/do/patch/projectUserForTag', data: { tag: newTag, id: idLeft } })
            this.value.tagLeft = newTag
        }
    },
}
</script>
<style scoped lang="scss">
.a-card {
    display: inline-block;
    width: 320px;
    margin: 0 20px 20px 0;
}

.title {
    height: 60px;
    font-size: var(--a-font-size-medium);
    margin: 8px 12px;
    overflow: hidden;

    .a-text {
        cursor: pointer;
    }
}

.more {
    border-top: 1px solid var(--a-card-border-color);
    padding: 8px 12px;
    color: var(--a-text-color-secondary);
    display: flex;
}

.left {
    flex: 1
}

.right {
    width: 60px;
    text-align: right;
}

.star {
    padding: 2px 6px 0 0;
}
</style>