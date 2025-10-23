<template>
    <NodeViewWrapper as="div" :class="'block-node-wrapper block-' + node.attrs.blockType">
        <div class="block-header">
            <span class="block-title">{{ getBlockTypeLabel(node.attrs.blockType) }} 编辑器</span>
            <span class="block-type-badge">{{ node.attrs.blockType }}</span>
        </div>

        <div class="block-content">
            <!-- 思维导图编辑器 -->
            <div v-if="node.attrs.blockType === 'mindmap'" class="mindmap-editor">
                <textarea v-model="localContent" @input="onContentChange" placeholder="请输入思维导图内容..."
                    class="mindmap-textarea" />
            </div>

            <!-- 流程图编辑器 -->
            <div v-else-if="node.attrs.blockType === 'flow'" class="flow-editor">
                <div contenteditable="true" @input="onContentChange" class="flow-content" v-html="localContent"></div>
            </div>

            <!-- 电子表格编辑器 -->
            <div v-else-if="node.attrs.blockType === 'spreadsheet'" class="spreadsheet-editor">
                <div class="spreadsheet-placeholder">
                    <p>电子表格编辑器</p>
                    <p>{{ localContent || '暂无内容' }}</p>
                </div>
            </div>

            <!-- 绘图编辑器 -->
            <div v-else-if="node.attrs.blockType === 'excalidraw'" class="excalidraw-editor">
                <div class="excalidraw-placeholder">
                    <p>绘图编辑器</p>
                    <p>{{ localContent || '暂无内容' }}</p>
                </div>
            </div>
        </div>
    </NodeViewWrapper>
</template>

<script>

export default ({

    props: {
        node: {
            type: Object,
            required: true,
        },
        editor: {
            type: Object,
            required: true,
        },
        getPos: {
            type: Function,
            required: true,
        },
        updateAttributes: {
            type: Function,
            required: true,
        },
    },

    data() {
        return {
            localContent: this.node.attrs.content || '',
        }
    },

    watch: {
        'node.attrs.content': {
            handler(newContent) {
                if (newContent !== this.localContent) {
                    this.localContent = newContent;
                }
            },
            immediate: true,
        },
    },

    methods: {
        onContentChange(event) {
            if (event.target.tagName === 'TEXTAREA') {
                this.localContent = event.target.value;
            } else if (event.target.contentEditable === 'true') {
                this.localContent = event.target.innerHTML;
            }

            // 实时更新节点属性
            this.updateAttributes({
                content: this.localContent
            });
        },

        getBlockTypeLabel(blockType) {
            const labelMap = {
                'mindmap': '思维导图',
                'flow': '流程图',
                'spreadsheet': '电子表格',
                'excalidraw': '绘图'
            };
            return labelMap[blockType] || blockType;
        },

        getTypeValue(blockType) {
            const typeMap = {
                'mindmap': 3,
                'flow': 4,
                'spreadsheet': 5,
                'excalidraw': 6
            };
            return typeMap[blockType] || 3;
        },
    },
})
</script>

<style scoped>
.block-node-wrapper {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    margin: 16px 0;
    padding: 16px;
    background: #fafafa;
}

.block-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 1px solid #e0e0e0;
}

.block-title {
    font-weight: bold;
    color: #333;
}

.block-type-badge {
    background: #1890ff;
    color: white;
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 12px;
}

.block-content {
    margin-bottom: 12px;
}

.mindmap-textarea {
    width: 100%;
    height: 200px;
    border: 1px solid #ddd;
    padding: 8px;
    border-radius: 4px;
    resize: vertical;
    font-family: inherit;
}

.flow-content {
    border: 1px solid #ddd;
    padding: 8px;
    min-height: 200px;
    border-radius: 4px;
    background: white;
    outline: none;
}

.spreadsheet-placeholder,
.excalidraw-placeholder {
    border: 1px solid #ddd;
    padding: 20px;
    text-align: center;
    background: white;
    border-radius: 4px;
    color: #666;
}

.block-actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
}

.save-btn,
.change-type-btn {
    background: #1890ff;
    color: white;
    border: none;
    padding: 6px 12px;
    border-radius: 4px;
    cursor: pointer;
    font-size: 14px;
}

.save-btn:hover,
.change-type-btn:hover {
    background: #40a9ff;
}

.change-type-btn {
    background: #52c41a;
}

.change-type-btn:hover {
    background: #73d13d;
}
</style>