<template>
    <div>
        <div class="k-repository">
            <div class="z-row">
                <div class="z-12 h3">
                    {{data.title}}
                </div>
                <div class="z-12" style="text-align: right">
                    <!--<span class="z-button primary" @click="saveModel">保存</span>-->
                    <!--<div v-if="readonly">-->
                    <z-button plain target="_blank" size="small"
                              v-href="'/view.html?id='+data._id">
                        查看
                    </z-button>
                    <z-button plain v-if="!pid" size="small" @click="set">设置</z-button>
                    <!--<span class="z-button primary" @click="editModel">编辑</span>-->
                    <!--</div>-->
                    <!--<div v-else>-->
                    <z-wicket plain action="/note/patch.do" size="small" :prop="data" view="J_title"
                              :callback="changeTitle">修改标题
                    </z-wicket>
                    <z-button plain size="small" @click="addNode">新增章节</z-button>
                    <!--<span class="z-button primary" @click="cancel">取消</span>-->
                    <!--</div>-->
                </div>
            </div>
            <Chapter key="root" :value="summary.sons" :readonly="readonly"></Chapter>
        </div>
        <AddDoc :parent="data._id"></AddDoc>
        <Board :itemId="docId" :nodes="summary.sons"></Board>
        <Set :permision="data.permision" :note="data._id"></Set>
    </div>
</template>
<script>
    import Chapter from "./chapter"
    import Methods from "./methods"
    import AddDoc from "./addDoc"
    import Board from "./board"
    import Set from "./set"

    export default {
        props: ["data", "summary", "pid"],
        components: {Chapter, AddDoc, Board, Set},
        data: function () {
            return {
                showSet: false,
                readonly: false,
                docId: null
            }
        },
        mounted: function () {
            $.on("chapterEvt", this.subscribe);
            // let that = this;
            // 保存快捷键
            // $(document).off("keydown.t").on("keydown.t", function (e) {
            //     let evt = e || window.event;
            //     let k = evt.keyCode;
            //     if (k === 83 && (evt.shiftKey || evt.metaKey)) {
            //         evt.preventDefault();
            //         evt.stopPropagation();
            //         that.$parent.save(true, that.content, 0);
            //         return false;
            //     }
            // });
            let doc = $.getParam("docId");
            if (!doc) {
                return;
            }
            this.docId = doc;
        },
        methods: Methods
    }
</script>