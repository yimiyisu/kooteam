<template>
    <el-dialog v-model="visible" title="导入本地文件" width="400" @close="close" append-to-body>
        <el-form label-width="100">
            <el-form-item label="文件类型">
                <el-radio-group v-model="type">
                    <el-radio :value="1">Word文件</el-radio>
                    <el-radio :value="2">Excel文件</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="选择文件">
                <el-upload :before-upload="before" :show-file-list="false" :accept="accept" :disabled="!type">
                    <el-button :disabled="!type" type="primary">点击上传文件</el-button>
                </el-upload>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
export default {
    data() {
        return {
            visible: false,
            type: null,
            editor: null
        }
    },
    beforeUnmount() {
        $.off("importMceFile");
    },
    created() {
        $.on("importMceFile", (editor) => {
            this.editor = editor
            this.visible = !this.visible
        })
    },
    computed: {
        accept() {
            return this.type === 1 ? '.docx,.doc' : '.xls,.xlsx'
        }
    },
    methods: {
        close() {
            this.type = null;
            this.visible = false;
        },
        async before(file) {
            if (this.type === 1) {
                const { mammoth } = window
                if (!mammoth) {
                    $.lib('mammoth.browser.min.js', async () => {
                        await this.insertWord(file)
                    })
                } else {
                    await this.insertWord(file)
                }
            } else {
                console.log(file);
                this.editor.insertContent("插入上传的文件内容");
            }
            this.close()
            return false;
        },
        async insertWord(file) {
            try {
                const { mammoth } = window
                const result = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
                this.editor.insertContent(result.value);
            } catch (error) {
                $.error('转换 Word 文件出错：', error);
            }
        },
        insertExcel() { }
    },
}
</script>
