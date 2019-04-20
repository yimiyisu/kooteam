<template>
    <div>
        <z-draggable :list="value" group="item" @end="end">
            <div class="group" v-for="item in value" :key="item.id">
                <div class="guide" :data-id="item.id"></div>
                <div class="item" :data-id="item.id">
                    <hr/>
                    <i v-if="item.link==='folder'"
                       class="folder z-icon" @click="fold(item)" :class="{'hide':item.status===false}"></i>
                    <div class="header">
                        <Icon :type="item.type||item.link"></Icon>
                        <div @click="view(item)" class="title">
                            {{item.title}}
                        </div>
                    </div>
                    <div v-if="readonly" class="info">
                        {{item.link|idate}}
                    </div>
                    <div v-else class="info">
                        <i class="z-icon hover" title="修改标题"
                           @click="change(item)">&#xe22b;</i>
                        <i class="z-icon hover" title="添加子章节"
                           @click="trigger(item,'add')">&#xe145;</i>
                        <z-confirm class="z-icon hover" type="text" tip="确定删除文档吗" @click="trigger(item,'remove')">
                            &#xe872;
                        </z-confirm>
                    </div>
                </div>
                <Chapter :key="'s'+item.id" v-if="item.status!==false&&item.sons&&item.sons.length>0"
                         :readonly="readonly" :value="item.sons"></Chapter>
            </div>
        </z-draggable>
        <z-dialog title="修改标题" width="540px" :visible.sync="isEdit">
            <z-form label-width="100px">
                <z-field label="文档标题">
                    <z-input width="340px" type="text" koo="need" v-model="title"></z-input>
                </z-field>
            </z-form>
            <div slot="footer" class="dialog-footer">
                <z-button @click="isEdit = false">取 消</z-button>
                <z-button type="primary" @click="update">确 定</z-button>
            </div>
        </z-dialog>
    </div>
</template>
<script>
    import Icon from "./icon"

    export default {
        name: "Chapter",
        props: ["value", "readonly", "parent"],
        components: {Icon},
        data: function () {
            return {
                title: "",
                current: null,
                isEdit: false
            }
        },
        methods: {
            toggle: function () {
                this.isEdit = !this.isEdit;
            },
            change: function (item) {
                this.current = item;
                this.title = item.title;
                this.isEdit = true;
            },
            end(evt) {
                if (evt.newIndex === evt.oldIndex) {
                    return;
                }
                this.trigger(null, "save");
                // $.http(this.data, "/note/patch.do", function (reback) {
                // }, this);
            },
            update: function () {
                this.current.title = this.title;
                this.isEdit = false;
                let data = {
                    _id: this.current.id,
                    title: this.title
                };
                // 同时需要更新文档里的标题内容
                if (data._id) {
                    $.http(data, "/note/patch.do", function (reback) {
                    }, this);
                }
                this.trigger(null, "save");
            },
            view: function (item) {
                if (item.link === "folder") {
                    return item.status = !item.status;
                }
                if (!item.link) {
                    return this.trigger(item, 'newDoc');
                }
                // 变更状态
                if (item.link === "folder") {
                    item.status = !item.status;
                    return this.trigger(item.id, 'folder');
                }
                this.trigger(item.link, 'doc');
            },
            fold: function (item) {
                item.status = !item.status;
            },
            trigger: function (item, evt) {
                // if (evt === "remove") {
                //     return;
                // }
                let param = {
                    event: evt,
                    data: item
                };
                $.emit("chapterEvt", param);
            }
        }
    }
</script>