<template>
    <z-row class="z-row k-files-list" v-if="files.length !== 0">
        <z-col :span="1"><span class="ft icon h2">&#xe8b9;</span></z-col>
        <z-col :span="23">
            <div class="title">
                <strong>附件</strong>
                <label for="J_list_file" class="right">
                    <span class="el-button el-button--primary el-button--mini">添加附件</span>
                    <input class="hide" type="file" id="J_list_file" name="file" @change="change"/>
                </label>
            </div>
            <div class="item-file z-row" v-for="(item,inx) in files">
                <div class="z-6 left-txt">
                    {{item.title.substring(item.title.length-3, item.title.length)}}
                </div>
                <div class="z-16 right-content">
                    <a :href="domain+item.url" target="_blank">
                        <p class="title">{{item.title}}</p>
                        <span>{{item.addtime|date}}</span>
                    </a>
                    <z-confirm type="text" @click="del(item._id, item.title, inx)" class="z-link remove"
                               tip="确定删除该附件吗？">删除
                    </z-confirm>
                </div>
            </div>
        </z-col>
    </z-row>
</template>
<script>
    export default {
        name: "detailAttach",
        data() {
            return {
                files: [],
                itemId: null
            }
        },
        inject: ["log", "getThing"],
        computed: {
            domain() {
                if (zen.mode > 1) {
                    return "";
                }
                return "https://img.yimiyisu.com";
            }
        },
        created() {
            let thing = this.getThing();
            this.itemId = thing._id;
            $.on("uploadAttach", this.add);
            this.load();
        },
        destroyed() {
            $.off("uploadAttach");
        },
        methods: {
            add(item) {
                this.files.push(item);
            },
            load() {
                $.post({parentId: this.itemId}, '/select/attachByParentId.json', (reback) => {
                    this.files = reback.data;
                }, this);
            },
            del(id, title, inx) {
                $.post({_id: id,}, '/delete/attach.json', (reback) => {
                    this.files.splice(inx, 1);
                    this.log("删除了附件 " + title);
                });
            },
            change(val) {
                let file = val.target.files;
                $.post({file: file[0], parentId: this.itemId}, '/upload/file.do', function (reback) {
                    let data = reback.data;
                    this.files.push(reback.data);
                    $.post({
                        parentId: this.itemId,
                        url: data.url,
                        size: data.size,
                        title: data.title
                    }, "/put/attach.json", function () {
                        this.load();
                    }, this);
                    this.log("添加了附件 " + file[0].name);
                }, this)
            }
        }
    }
</script>