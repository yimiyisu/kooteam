<template>
    <el-row>
        <el-col :span="1"><z-icon value="book" /> </el-col>
        <el-col :span="23">
            关联知识库：<z-action tooltip="添加知识库" width="900px" size="small" link icon="plusCircle" title="关联知识库">
                <Selector @update="change" />
            </z-action>
            <div v-if="notes.length > 0" class="list">
                <el-link v-for="(note, idx) in notes" :key="note" :href="'/kooteam/knowledge/' + note" target="_blank">
                    <z-text type="primary" :modelValue="note" depend="note_content" />
                    <z-icon value="externalLink" />
                    <z-icon class="hover" @click.prevent="remove(idx)" value="trash2" />
                </el-link>
            </div>
        </el-col>
    </el-row>
</template>
<script>
import Selector from './selector.vue';
export default {
    components: { Selector },
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
        remove(idx) {
            this.notes.splice(idx, 1)
            this.value.notes = this.notes
            this.save()
        },
        change(data) {
            data.forEach(id => {
                if (id && !this.notes.includes(id)) {
                    this.notes.unshift(id)
                }
            });
            this.save()
        },
        async save() {
            this.value.notes = this.notes
            await $.post({ url: '/do/patch/thing', data: this.value })
        }
    },
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
    position: relative;

    .hover {
        position: absolute;
        top: 6px;
        right: 6px;
        display: none;
    }

    &:hover .hover {
        display: inline-block;
    }

    .a-icon {
        margin-left: 6px;
    }
}
</style>