<template>
    <Editor :value="value" @finish="refresh" />
    <z-table ref="table" url="/do/select/comment" :size="10" :params="params">
        <template #default="{ row }">
            <el-row :key="row.id" class="item">
                <el-col :span="4">
                    <z-avatar :value="row.uid" />
                </el-col>
                <el-col :span="20">
                    <div class="content">
                        {{ row.content }}
                        <div class="images" v-if="row.images">
                            <el-image v-for="(img, idx) in row.images" :hide-on-click-modal="true" :zoom-rate="1.2"
                                :initial-index="idx" fit="cover" :max-scale="7" :min-scale="0.2"
                                :preview-src-list="row.images" :src="img" :key="idx" />
                        </div>
                    </div>
                    <el-row>
                        <el-col :span="18">
                            <z-idate :value="row.updateGmt" />
                        </el-col>
                        <el-col :span="6">
                            <z-action v-if="isOnwer || row.uid === profile.id" link icon="trash2" mode="confirm"
                                url="/do/delete/comment" :data="row" />
                        </el-col>
                    </el-row>

                </el-col>
            </el-row>
        </template>
    </z-table>
</template>
<script>
import Editor from './editor.vue';
export default {
    components: { Editor },
    props: { value: Object },
    data() {
        return {
            isOnwer: false,
        };
    },
    computed: {
        params() {
            const thingId = this.value.id
            return { thingId }
        }
    },
    inject: ["log", "profile"],
    created() {
        const { value, profile } = this;
        this.isOnwer = value.owner === profile.id;
    },
    methods: {
        refresh() {
            this.$refs['table'].reload()
        }
    },
};
</script>
<style lang="scss" scoped>
.z-table {
    font-size: 12px;
}

.item {
    border-bottom: 1px solid var(--a-border-color-extra-light);
    padding-bottom: 4px;
    margin-bottom: 14px;

    &:hover .a-col-6 {
        visibility: visible;
    }
}

.images {
    .a-image {
        margin-top: 4px;
        width: 40px;
        height: 40px;
        overflow: hidden;
        border-radius: 4px;
        border: 1px solid var(--a-border-color);
    }
}

.a-col-18 {
    margin-top: 8px;
    color: var(--a-text-color-secondary);
}

.a-col-6 {
    text-align: right;
    visibility: hidden;
}
</style>