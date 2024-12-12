<template>
    <z-action icon="settings" type="text" ref="action" :beforeShow="show" mode="drawer" title="知识库设置">
        <el-tabs v-model="current">
            <el-tab-pane label="成员管理" name="member">
                <z-block href="/note/member" :params="listParams" />
            </el-tab-pane>
            <el-tab-pane label="其他设置" name="other" lazy>
                <z-block url="/do/get/note" :params="detailParams">
                    <template #default="result">
                        <z-form :fields="fields" url="/do/patch/noteForBasic" :data="result">
                            <template #quit>
                                <el-form-item label="退出项目">
                                    <Quit type="danger" @finish="close" label="退出知识库" :relateId="value.idLeft" />
                                </el-form-item>
                            </template>
                        </z-form>
                    </template>
                </z-block>
            </el-tab-pane>
        </el-tabs>
    </z-action>
</template>
<script>
import Quit from './quit.vue';
export default {
    components: { Quit },
    props: {
        value: Object
    },
    computed: {
        listParams() {
            const { id } = this.value
            return { noteId: id }
        },
        detailParams() {
            return { id: this.value.id }
        }
    },
    data() {
        return {
            current: null,
            fields: [
                { label: "知识库名", name: "title" },
                { label: "公共读", name: "pub", type: "switch" },
                { name: "quit" },
                {
                    name: "configs",
                    children: [
                        { label: "知识库描述", name: "describe", type: "textarea" },
                        { label: "知识库封面", name: "cover", type: "image", tip: "建议尺寸: 400x300" }
                    ]
                }
            ]
        }
    },
    methods: {
        close() {
            this.$refs['action'].close()
        },
        show() {
            this.current = 'member'
        }
    },
}
</script>