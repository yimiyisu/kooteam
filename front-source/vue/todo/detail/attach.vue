<template>
    <z-row class="z-row k-files-list" v-if="files.length !== 0">
        <z-col :span="1">
            <span class="ft icon h2">&#xe8b9;</span>
        </z-col>
        <z-col :span="23">
            <div class="title">
                <strong>附件</strong>
                <label for="J_attach_file" class="right">
                    <span class="el-button el-button--primary el-button--mini">添加附件</span>
                </label>
            </div>
            <div class="item-file z-row" v-for="(item,inx) in files">
                <div class="z-6 left-txt">{{item.title.substring(item.title.length-3, item.title.length)}}</div>
                <div class="z-16 right-content">
                    <a :href="item.url" target="_blank">
                        <p class="title">{{item.title}}</p>
                        <z-idate :value="item.addtime"></z-idate>
                    </a>
                    <z-confirm
                            type="text"
                            @click="del(item._id, item.title, inx)"
                            class="z-link remove"
                            tip="确定删除该附件吗？"
                    >删除
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
            };
        },
        inject: ["log", "getThing"],
        created() {
            let thing = this.getThing();
            this.itemId = thing._id;
            $.on("uploadAttach", this.upload);
            this.load();
            document.addEventListener("paste", this.pasteImage);
        },
        beforeDestroy() {
            document.removeEventListener("paste", this.pasteImage);
            $.off("uploadAttach");
        },
        methods: {
            pasteImage(ev) {
                let clipboardData = ev.clipboardData || ev.originalEvent.clipboardData;
                if (!clipboardData || !clipboardData.items) {
                    return;
                }
                let item = clipboardData.items[0],
                    imageRe = new RegExp(/image\/.*/);
                if (!imageRe.test(item.type)) {
                    return;
                }
                //阻止默认行为即不让剪贴板内容在div中显示出来
                ev.preventDefault();
                let blob = item.getAsFile();
                this.upload(blob);
            },
            load() {
                $.post(
                    {parentId: this.itemId},
                    "/select/attachByParentId.json",
                    reback => {
                        this.files = reback.data;
                    },
                    this
                );
            },
            del(id, title, inx) {
                $.post({_id: id}, "/delete/attach.json", reback => {
                    this.files.splice(inx, 1);
                    this.log("删除了附件 " + title);
                });
            },
            upload(file) {
                let formData = new FormData();
                formData.append("file", file);
                formData.append("parentId", this.itemId);
                formData.append("app", zen.name);
                $.upload(
                    formData,
                    "/upload/file.do",
                    data => {
                        this.files.push(data);
                        $.post(
                            {
                                parentId: this.itemId,
                                url: data.url,
                                size: data.size,
                                title: data.title
                            },
                            "/put/attach.json"
                        );
                        this.log("添加了附件 " + data.name);
                    },
                    this
                );
            }
        }
    };
</script>