<template>
    <z-action fixed="noteDetail" ref="action" :beforeShow="show" width="95%" mode="drawer">
        <el-container>
            <el-aside width="260px">
                <h2 class="title1">
                    <span @click="view">{{ title }}
                        <z-icon value="externalLink" />
                    </span>
                    <z-action link width="540px" :beforeSubmit="add" :fields="fields" title="新建文档" icon="plusCircle" />
                </h2>
                <div class="tree">
                    <el-tree ref="tree" draggable highlight-current :current-node-key="current" @node-drop="save"
                        node-key="id" :data="content" :props="defaultProps">
                        <template #default="{ node, data }">
                            <div class="node-title" @click="open(data)">
                                {{ data.title }}
                            </div>
                            <div class="node-info">
                                <z-action link icon="plus" v-if="data.type === 2" width="540" title="添加子文章"
                                    :fields="fields" :beforeSubmit="(form) => add(form, data)" />
                                <z-action link icon="trash" title="确定移出目录吗" mode="confirm"
                                    @confirm="remove(node, data)" />
                            </div>
                        </template>
                    </el-tree>
                    <el-empty v-if="!content" />
                </div>
                <Extend @open="open" @restore="restore" :randId="randId" :noteId="noteId" />
            </el-aside>
            <el-main ref="canvas" style="--a-main-padding: 0">
                <h3 class="title2">
                    {{ title2 }}
                    <z-action v-if="!isFull" link tooltip="修改标题" width="500px" :data="{ title: title2 }"
                        :fields="titleFields" title="修改标题" icon="edit2" :beforeSubmit="saveTitle" />
                </h3>
                <div class="close">
                    <z-icon v-if="isFull" size="18" @click="full" tooltip="退出全屏" value="minimize" />
                    <z-icon v-else size="18" @click="full" tooltip="全屏模式" value="maximize" />
                    <!-- <z-icon tooltip="关闭文档" value="x" size="18" @click="close" /> -->
                </div>
                <div class="detail">
                    <Editor v-if="params" :key="params.id" :params="params" />
                    <el-empty v-else description="请选择文件" />
                </div>
                <!-- <z-block class="detail" v-if="params" href="/editor" :params="params" /> -->
            </el-main>
        </el-container>
    </z-action>
</template>
<script>
import Editor from '@/editor/index';
import { useZIndex } from 'element-plus';
import Extend from './extend.vue';
export default {
    components: { Extend, Editor },
    data() {
        return {
            title: null,
            isFull: false,
            titleFields: [{ name: 'title', label: '文档标题' }],
            defaultProps: {
                children: 'sons',
                label: 'title',
                disabled: (data) => !data.id,
            },
            fields: [
                { label: "文档标题", name: "title" },
                {
                    label: "文档类型", name: "type", type: 'radiobox', segmented: true,
                    options: [
                        { label: '综合文档', value: 1 },
                        { label: '目录', value: 2 },
                        { label: '脑图', value: 3 },
                        { label: '流程图', value: 4 },
                        // { label: '手绘白板', value: 6 }, 第二期支持，需要接入素材库
                        { label: '表格', value: 5 },
                    ],
                    default: 1
                }
            ],
            randId: null,
            noteId: null,
            title2: null,
            current: null,
            params: null,
            content: null
        }
    },
    methods: {
        async show(data) {
            const { article } = this.$route.query
            if (article) {
                this.$router.replace({ query: { ...this.$route.query, article: undefined } })
                this.params = null
            }
            const { id } = data;
            this.isFull = false
            this.noteId = id
            const result = await $.get({ url: "/do/get/note", data: { id } })
            this.content = result.content || [];
            this.title = result.title;
        },
        async add(formData, parent) {
            if (formData.type !== 2) {
                formData.noteId = this.noteId
                // 创建文字
                const result = await $.post({ url: "/do/put/note_content", data: formData })
                formData.id = result.id
            } else {
                formData.id = $.uid()
            }
            if (!parent) {
                this.content.push(formData)
            } else {
                if (!parent.sons) {
                    parent.sons = [formData]
                } else {
                    parent.sons.push(formData)
                }
            }
            await this.save()
            if (formData.type !== 2) {
                this.open(formData)
            }
        },
        remove(node, data) {
            const parent = node.parent
            const children = parent.data.sons || parent.data
            const index = children.findIndex((d) => d.id === data.id)
            const item = children.splice(index, 1)[0]
            if (item.id) {
                $.post({ url: "/do/patch/noteContentStatus", data: { type: 9, id: item.id } })
            }
            this.randId = parseInt(Math.random() * 1000)
            this.save()
        },
        view() {
            $.open('/view.html?id=' + this.noteId)
        },
        async save() {
            await $.post({ url: "/do/patch/note", data: { id: this.noteId, content: this.content } })
        },
        full() {
            const { isFull } = this
            let nextIndex = isFull ? 0 : useZIndex().nextZIndex()
            $.fullscreen(this.$refs['canvas'].$el, nextIndex)
            this.isFull = !isFull
        },
        saveTitle(result) {
            const id = this.current
            const title = result.title
            const data = { id, title }
            $.post({
                url: '/do/patch/note_content',
                data,
                success: () => {
                    this.asyncTitle(data, this.content);
                    this.title2 = title
                    this.save()
                }
            })
        },
        asyncTitle(item, list) {
            for (let i = 0; i < list.length; i++) {
                if (list[i].id === item.id) {
                    return list[i].title = item.title
                }
                if (list[i].sons) {
                    this.asyncTitle(item, list[i].sons)
                }
            }
        },
        async open({ id, type }) {
            if (type === 2) {
                return
            }
            const result = await $.get({ url: "/do/get/note_content", data: { id } })
            const { query } = this.$route;
            this.title2 = result.title
            this.current = id
            this.params = result;
            if (query.article !== id) {
                this.$router.replace({ query: { ...query, article: id } })
            }
        },
        restore(item) {
            this.content.push(item)
            this.save()
        },
        close() {
            this.$refs['action'].close()
        }
    },
}
</script>
<style lang="scss" scoped>
.a-aside {
    background: var(--a-fill-color-extra-light);
    border-right: 1px solid var(--a-border-color-light);
    position: relative;
}

.a-container {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background: var(--a-bg-color);
    overflow: hidden;
}

.a-tree {
    --a-tree-node-content-height: 32px;
    background: transparent;
    padding: 3px 0;
}

.node-title {
    flex: 1;
    line-height: var(--a-tree-node-content-height);
}

.node-info {
    width: 60px;
    text-align: right;
    visibility: hidden;
}

:deep(.a-tree-node__content:hover) {
    .node-info {
        visibility: visible;
    }
}

.title1 {
    text-overflow: ellipsis;

    .a-button {
        position: absolute;
        right: 6px;
        top: 12px;
    }
}

.title1,
.title2 {
    height: 24px;
    overflow: hidden;
    cursor: pointer;
    position: relative;
    margin: 0;
    padding: 10px 48px 10px 18px;
    border-bottom: 1px solid var(--a-border-color-light);
}

.title2 {
    font-weight: normal;
    font-size: 16px;
}

.close {
    position: absolute;
    top: 12px;
    right: 58px;
    text-align: right;
}

.detail {
    height: 85vh;
}

.fullscreen {
    :deep(.tox-sidebar-wrap) {
        padding: 20px 120px 0 120px;
        background: var(--a-border-color-lighter);
    }

    :deep(.tox-sidebar-wrap) {
        border-radius: 4px;
        box-shadow: rgba(0, 0, 0, 0.5) 0px 0px 12px 0px
    }

    :deep(.tox-edit-area__iframe) {
        border-radius: 4px;
    }
}
</style>