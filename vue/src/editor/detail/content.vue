<template>
    <el-empty v-if="empty" description="该知识库不存在" style="margin:100px auto" />
    <el-container v-else>
        <transition name="a-fade-in">
            <el-aside width="300px" v-show="visible">
                <h2 class="title1">
                    {{ data.title }}
                </h2>
                <Chapter v-for="(item, index) in data.content" :current="current" :key="item.id" :value="item"
                    :idx="index + 1" @open="open" />
            </el-aside>
        </transition>
        <el-main ref="main" :class="{ max: !visible || isFulled }">
            <div class="tool">
                <z-icon v-show="!isFulled" @click="toggle" value="menu" class="hover" />
                <z-icon @click="fullscreen" :value="isFulled ? 'minimize' : 'maximize'" class="hover" />
                <z-icon @click="print" value="printer" class="hover" />
            </div>
            <z-icon value="chevronLeft" v-if="prevId" size="48" @click="() => open(prevId)" class="hover prev" />
            <z-icon value="chevronRight" v-if="nextId" size="48" @click="() => open(nextId)" class="hover next" />
            <div ref="content" class="content">
                <z-block url="/do/get/note_content" :params="params" @finish="renderPlugin">
                    <template #default="result">
                        <h3 class="title2">
                            {{ result.title }}
                        </h3>
                        <div v-if="result.type === 1" class="mce-content-body" v-html="result.content"></div>
                        <Other v-else :data="result" :key="result.id" />
                    </template>
                </z-block>
            </div>
        </el-main>
    </el-container>
</template>
<script>
// import Plugin from '../blocks/index';
import Chapter from './chapter.vue';
import Other from './other.vue';

export default {
    components: { Chapter, Other },
    props: {
        data: Object
    },
    data() {
        return {
            empty: false,
            title: null,
            params: null,
            isFulled: false,
            content: "",
            prevId: null,
            nextId: null,
            isNext: false,
            visible: true,
            current: null
        }
    },
    created() {
        if (!this.data || !this.data.content) {
            return this.empty = true
        }
        const { article } = this.$route.query;
        if (article) {
            this.current = article
            this.params = { id: article }
        } else {
            let id = this.getDefaultId(this.data.content)
            this.current = id
            this.params = { id }
        }

    },
    methods: {
        open(item) {
            const id = item.id ? item.id : item
            const { query } = this.$route
            this.current = id
            this.params = { id }
            this.nextId = null
            this.prevId = null
            this.isNext = false
            this.initNavId(this.data.content)
            this.$router.push({ query: { ...query, article: id } })
        },
        initNavId(list) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                if (this.isNext && item.id) {
                    this.nextId = item.id
                    return true
                }
                if (this.current === item.id) {
                    this.isNext = true
                    if (item.sons && this.initNavId(item.sons)) {
                        return true
                    }
                    continue
                }
                if (!this.isNext) {
                    this.prevId = item.id
                }
                if (item.sons && this.initNavId(item.sons)) {
                    return true
                }
            }
            return false
        },
        toggle() {
            this.visible = !this.visible
        },
        print() {
            const el = this.$refs['content']
            $.print(el)
        },
        fullscreen() {
            let element = this.$refs['main'].$el
            $.fullscreen(element, this.isFulled)
            this.isFulled = !this.isFulled
        },
        getDefaultId(list, current) {
            for (let i = 0; i < list.length; i++) {
                const item = list[i]
                if (item.id) {
                    return list[i].id
                }
                if (item.sons) {
                    const result = this.getDefaultId(item.sons, current)
                    if (result) {
                        return result
                    }
                }
            }
            return null
        },
        renderPlugin(data, el) {
            this.$nextTick(() => {
                const sons = el.getElementsByClassName('k-doc')
                for (let i = 0; i < sons.length; i++) {
                    // Plugin(sons[i], false)
                }
                $.lib(['tinymce/prism.js', 'tinymce/prism.css'])
            })
        }
    },
}
</script>
<style lang="scss" scoped>
.a-aside {
    color: var(--a-text-color-primary);
    background: var(--a-fill-color-extra-light);
    border-right: 1px solid var(--a-border-color-lighter);
    position: relative;
}

.a-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    font-size: 14px;
    overflow: hidden;
}

.a-main {
    background: var(--a-bg-color);
    position: relative;
    --a-main-padding: 36px 20px;

    &.max .content {
        max-width: 1100px;
    }
}

.tool {
    position: absolute;
    top: 10px;
    left: 12px;
    color: var(--a-text-color-placeholder);

    .a-icon {
        margin-right: 8px;
    }
}

.title1 {
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0 0 8px 0;
    line-height: 36px;
    font-weight: normal;
    padding: 8px 14px;
    border-bottom: 1px solid var(--a-border-color-lighter);
}

.title2 {
    margin: 0 0 30px 0;
    font-size: 2em;
    color: var(--a-text-color-primary);
}

.prev,
.next {
    position: absolute;
    top: 48%;
    z-index: 10;
    color: var(--a-text-color-disabled)
}

.prev {
    left: 28px;
}

.next {
    right: 28px;
}

.content {
    max-width: 800px;
    height: 100%;
    margin: 0 auto;
    background: var(--a-bg-color);
}
</style>