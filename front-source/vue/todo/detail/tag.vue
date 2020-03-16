<template>
    <div class="k-todo-tag">
        <label @click="show">待添加</label>
        <div v-if="isShow&&isEdit" class="tags">
            <input type="text" v-model="newText" placeholder="请输入标签名称"/>
            <div class="tag">
                    <span v-for="(cl,idx) in colors" @click="selectColor(idx)"
                          :style="'background:'+cl ">
                        <i class="ft icon" v-if="newColor===idx">&#xe5ca;</i>
                    </span>
            </div>
            <div class="operator">
                <span class="z-button small" @click="cancel">取消</span>
                <span class="z-button primary small" @click="newTag">确定</span>
            </div>
        </div>
        <div v-if="isShow&&!isEdit" class="tags">
            <div class="tag">
                <span v-for="(tag,idx) in tags" @click="selectTag(idx)"
                      :style="'background:'+tag.color">{{tag.text}}</span>
            </div>
            <div class="operator">
                <span class="z-button small" @click="editModal">新增</span>
                <span class="z-button small" @click="close">取消</span>
                <span class="z-button small primary" @click="addTag">确定</span>
            </div>
        </div>
    </div>
</template>
<script>
    import Colors from "../../util/colors"

    export default {
        name: "detailTag",
        props: ["value"],
        data: function () {
            return {
                isShow: false,
                isEdit: false,
                newText: "",
                newColor: 0,
                selected: [],
                tags: [],
                colors: []
            }
        },
        created: function () {
            this.colors = Colors;
        },
        methods: {
            close: function () {
                this.isShow = false;
            },
            addTag: function () {

            },
            newTag: function () {
                if (!this.newText) {
                    return alert("标签名不能为空");
                }
                let tag = {
                    text: this.newText,
                    color: this.colors[this.newColor]
                };
                this.tags.push(tag);
                this.newText = "";
                this.cancel();
            },
            cancel: function () {
                this.isEdit = false;
            },
            editModal: function () {
                this.isEdit = true;
            },
            selectTag: function (idx) {

            },
            show: function () {
                this.isShow = true;
                if (this.tags.length === 0) {
                    this.isEdit = true;
                }
            },
            selectColor: function (idx) {
                this.newColor = idx;
            }
        }
    }
</script>