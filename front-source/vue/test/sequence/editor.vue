<template>
    <div class="editor" v-if="isShow" :style="{top:top,left:left,width:width,height:height}">
        <textarea @keyup="keyup" v-model="title" :style="{width:TxtWidth,'min-height':TxtHeight}"></textarea>
        <div class="theme" @click="colorClick" :style="{'background':color}"></div>
        <div class="colors" v-show="isColor">
            <span v-for="(cl,idx) in colors" :key="idx"
                  @click="select(cl)" :class="{'active':cl===color}" :style="{'background':cl}"></span>
        </div>
    </div>
</template>
<script>
    import Colors from "../../util/colors"
    import PatchAndQuery from "./util/patchAndQuery"

    export default {
        data: function () {
            return {
                isShow: false,
                isColor: false,
                node: null,
                title: null,
                color: Colors[0],
                colors: [],
                top: "",
                left: "",
                width: "",
                height: "",
                txt: "",
                TxtWidth: "",
                TxtHeight: "",
                itemType: {},
                id: null,
            }
        },
        mounted: function () {
            $.on("editFlow", this.init);
            $.on("editFlowCancel", this.hide);
            this.colors = Colors;
        },
        methods: {
            init: function (oldId) {
                let context = window.flowVue, id;
                for (let key in context.nodes) {
                    if (key === oldId) {
                        id = context.nodes[key].id;
                    }
                }
                for (let key in context.lines) {
                    if (key === oldId) {
                        id = context.lines[key].line.id;
                    }
                }
                let tempItemType = PatchAndQuery.getInfo(id),
                    offset = 30;
                this.id = id;
                this.itemType = tempItemType;
                this.txt = tempItemType.txt;
                this.showHideTxt();
                this.txt.hide();
                context.hideItem.unshift(tempItemType.txt.id);        // 打开编辑框时，隐藏文本
                this.isShow = true;
                this.isColor = false;
                let x = tempItemType.x - offset,
                    y = tempItemType.y - offset,
                    width = tempItemType.boxWidth + offset * 2,
                    height = tempItemType.boxHeight + offset * 2;
                if (width < 150) {
                    width = 150;
                }
                if (height < 110) {
                    height = 110;
                }
                let TxtWidth = width - 10;
                let TxtHeight = height - 20;
                this.top = y + "px";
                this.left = x + "px";
                this.width = width + "px";
                this.height = height + "px";
                this.TxtWidth = TxtWidth + "px";
                this.TxtHeight = TxtHeight + "px";
                window.flowVue.currentTargetId = "";   // 初始化targetId 否则按删除键位，会将节点删掉
                this.title = tempItemType.txtContent;
                let area = $("textarea", this.$el);
                this.$nextTick(function () {
                    area.focus();
                });
            },
            hide: function () {
                if (this.txt) {
                    this.txt.attr("text", this.title);
                    window.flowVue.save("editor");
                }
                this.isShow = false;
                this.txt = null;        // 重置txt 避免点击空白区域时，也重新保存数据
                this.showHideTxt();
            },
            keyup: function (e) {
                e.preventDefault();
                if (e.keyCode === 27) {
                    this.hide();
                }
            },
            colorClick: function () {
                this.isColor = !this.isColor;
            },
            select: function (cl) {
                this.color = cl;
                let pathId = this.itemType.pathId,
                    context = window.flowVue,
                    tempPath = context.r.getById(pathId),
                    tempType = this.itemType.type;
                if (tempType === "node") {
                    tempPath.attr({fill: cl, stroke: cl});
                } else if (tempType === "line") {
                    tempPath.attr({stroke: cl});
                }
                window.flowVue.save();
            },
            showHideTxt: function () {
                let context = window.flowVue;
                for (let i = 0; i < context.hideItem.length; i++) {
                    let tempId = context.hideItem[i];
                    let tempItem = context.r.getById(tempId);
                    if (tempItem) {
                        tempItem.show();
                    }
                }
            }
        }
    }
</script>