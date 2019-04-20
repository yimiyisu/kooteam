<template>
    <z-dialog title="新建文档" width="540px" :visible.sync="isShow">
        <z-form label-width="100px">
            <z-field label="文档标题">
                <z-input width="340px" type="text" v-model="title"></z-input>
            </z-field>
            <z-field label="文档类型">
                <z-radio type="button" v-model="type">
                    <var value="1">文本</var>
                    <var value="2">脑图</var>
                    <var value="5">流程图</var>
                    <var value="4">目录</var>
                </z-radio>
            </z-field>
        </z-form>
        <div slot="footer" class="dialog-footer">
            <z-button plain @click="toggle">取 消</z-button>
            <z-button type="primary" @click="add">确 定</z-button>
        </div>
    </z-dialog>
</template>
<script>
    // 新建文档
    export default {
        props: ["parent"],
        data: function () {
            return {
                type: 1,
                isShow: false,
                title: "",
                item: {},
                types: [
                    {value: 1, title: "文本"},
                    {value: 2, title: "脑图"},
                    // {value: 3, title: "流程图"},
                    {value: 5, title: "流程图"},
                    {value: 4, title: "目录"}
                ],
            }
        },
        mounted: function () {
            this.$nextTick(function () {
                $.on("showAddDocBox", this.show);
            });
        },
        methods: {
            show: function (opt, params) {
                this.item = params.data;
                this.title = params.data.title;
                this.isShow = opt;
            },
            add: function () {
                let url = "/note/add.do";
                let item = {
                    content: "",
                    title: this.item.title,
                    type: this.type,
                    chapterId: this.item.id,
                    parentId: this.parent
                };
                // 是否是工程ID
                if (this.$parent.pid) {
                    item.isProject = "1";
                }
                // 新建目录
                if (this.type === 4) {
                    let params = {
                        event: "edit",
                        link: "folder",
                        data: this.item.id,
                        uid: zen.user.id,
                        title: this.title
                    };
                    // 同步标题
                    $.emit("chapterEvt", params);
                    return this.toggle();
                }
                $.http(item, url, function (reback) {
                    let data = reback.data;
                    let params = {
                        event: "edit",
                        link: data._id,
                        data: this.item.id,
                        type: this.type,
                        uid: data.uid,
                        title: this.title
                    };
                    // 同步标题
                    $.emit("chapterEvt", params);

                    this.title = "";
                    this.toggle();
                    params = {
                        event: "doc",
                        data: data._id
                    };
                    // 打开文档
                    $.emit("chapterEvt", params);
                }, this);
            },
            toggle: function () {
                this.isShow = !this.isShow;
            }
        }
    }
</script>