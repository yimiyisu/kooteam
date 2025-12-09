<template>
    <el-row>
        <el-col :span="1"><z-icon value="book" /> </el-col>
        <el-col :span="23">
            关联知识库：
            <div v-if="notes.length > 0" class="list">
                <el-link v-for="note in notes" :key="note" href="javascript:void(0);" @click.prevent="openNote(note)">
                    <z-text type="primary" :modelValue="note" depend="note_content" />
                    <z-icon value="externalLink" />
                </el-link>
            </div>
            <span v-else class="empty">暂无关联知识库</span>
        </el-col>
    </el-row>
</template>
<script>
export default {
    props: { value: Object },
    data() {
        return {
            notes: null,
        };
    },
    created() {
        this.notes = this.value.notes || []
    },
    methods: {
        async openNote(note) {
            const data = await this.getNoteContent(note)
            if (data && data.noteId) {
                window.open(`/view.html?id=${data.noteId}`, '_blank')
            }
        },
        async getNoteContent(note) {
            const data = await $.get({ url: '/do/get/note_content', data: { id: note } })
            return data
        }
    }
};
</script>
<style lang="scss" scoped>
.list {
    padding-top: 6px;
}

.a-link {
    text-align: left;
    display: inline-block;
    width: 50%;
    font-weight: normal;
    line-height: 28px;

    .a-icon {
        margin-left: 6px;
    }
}

.empty {
    color: var(--a-text-color-secondary);
    font-size: var(--a-font-size-base);
}
</style>
