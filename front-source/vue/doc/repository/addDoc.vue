<template>
    <span @click="toggle">
        <slot></slot>
        <z-dialog title="新建文档" width="540px" @close="toggle" v-if="isShow">
            <z-form label-width="100px" @submit.native.prevent>
                <z-field label="文档标题">
                    <z-input width="340px" type="text" v-model="title"></z-input>
                </z-field>
                <z-field label="文档类型">
                    <z-radio type="button" v-model="type" :data="types"></z-radio>
                </z-field>
            </z-form>
            <div slot="footer" class="dialog-footer">
                <z-button plain @click="toggle">取 消</z-button>
                <z-button type="primary" @click="add">确 定</z-button>
            </div>
        </z-dialog>
    </span>
</template>
<script>
    // 新建文档
    export default {
        props: ["parent", "item"],
        data: function () {
            return {
                type: 1,
                isShow: false,
                title: "",
                types: [
                    {value: 1, text: "文本"},
                    {value: 2, text: "脑图"},
                    {value: 6, text: "表格"},
                    {value: 5, text: "流程图"},
                    {value: 4, text: "目录"}
                ],
            }
        },
        inject: ["repository"],
        mounted() {
            this.item && (this.title = this.item.title);
        },
        methods: {
            add: function () {
                if (!this.title) {
                    return $.notice("标题不能为空", "error");
                }
                let context = this.repository, summary = context.summary;
                summary.id++;
                let params = {
                    content: "",
                    title: this.title,
                    type: this.type,
                    parentId: context.data._id,
                };
                $.post(params, "/note/add.do", function (reback) {
                    let data = reback.data;
                    if (this.item) {
                        this.mergeData(this.item, data, summary.id);
                        return context.save();
                    }
                    this.mergeData(params, data, summary.id);
                    if (this.parent) {
                        this.parent.sons.push(params);
                    } else {
                        summary.sons.push(params);
                    }
                    this.title = "";
                    context.save();
                }, this);
            },
            mergeData(origin, data, id) {
                !origin.sons && (origin.sons = []);
                origin.link = data._id;
                origin.id = id;
                origin.type = this.type;
                if (this.type === 4) {
                    origin.status = true;
                    origin.link = "folder";
                }
                this.toggle();
            },
            toggle: function () {
                this.isShow = !this.isShow;
            }
        }
    }
</script>