<template>
    <div v-if="isShow" class="k-doc-board">
        <div class="rep-nav">
            <dl class="z-left">
                <dd class="active" @click="close">
                    <i class="ft icon">&#xe6f6;</i>
                </dd>
                <dd @click="nav">
                    <z-tooltip content="知识库目录">
                        <i class="ft icon">&#xe699;</i>
                    </z-tooltip>
                </dd>
                <!--<dt v-tip="'编辑文档'" @click="edit" :class="{'on':!readonly}">-->
                <!--<i class="ft icon">&#xe22b;</i>-->
                <!--</dt>-->
                <dd>
                    <z-tooltip content="分享文档">
                        <Share :itemId="itemId" class="ft icon">&#xe8dc;</Share>
                    </z-tooltip>
                </dd>
                <dd>
                    <z-tooltip content="预览文档">
                        <a @click="debounce.flush" :href="'/view.html?id='+itemId" target="_blank">
                            <i class="ft icon">&#xe878;</i>
                        </a>
                    </z-tooltip>
                </dd>
                <dd>
                    <History :itemId="itemId"/>
                </dd>
                <dt>
                    {{value.title}}
                    <!--<ChangeTitle class="ft hover" :value="value">{{value.title}}</ChangeTitle>-->
                </dt>
            </dl>
            <div class="z-noselect">{{tooltip}}</div>
        </div>
        <component :is="name" :readonly="readonly" :type="value.type" v-model="content"></component>
        <div class="doc-nav" :class="{'show':showNav || value.type === 4}">
            <i class="ft icon close hover" @click="nav" v-show="showNav">&#xe710;</i>
            <Nav :value="nodes" :current="itemId"></Nav>
        </div>
    </div>
</template>
<script>
    import Editor from "../word/index";
    import Mind from "../mind/minder.js";
    import Graph from "../graph/index";
    import Grid from "../grid/index";
    import ChangeTitle from "./changeTitle";
    import Nav from "./nav";
    import Share from "./share"
    import History from "./history"

    const ComponentName = {
        1: "Editor",
        2: "Mind",
        5: "Graph",
        6: "Grid"
    };
    const Tips = {
        2: "选中节点，按enter键添加子节点，tab键添加同级节点",
        5: "按Ctr+S，保存文档"
    };
    export default {
        name: "docBoard",
        props: ["itemId", "nodes"],
        components: {Editor, Mind, Nav, Graph, ChangeTitle, Grid, Share, History},
        data() {
            return {
                isShow: false,
                showNav: false,
                readonly: false,
                timerId: 1,
                value: null,
                content: null,
                tooltip: "",
                debounce: null
            };
        },
        computed: {
            name() {
                if (!this.value) {
                    return "Editor";
                }
                return ComponentName[this.value.type];
            }
        },
        watch: {
            itemId(val) {
                this.init(val);
            }
        },
        created() {
            this.debounce = $.debounce(this.save, 15000);
            this.init(this.itemId);
            $.on("docContentUpdate", this.debounce);
        },
        beforeDestroy() {
            this.debounce.cancel();
            $.off("docContentUpdate");
        },
        methods: {
            unload(e) {
                this.debounce.flush();
                let msg = "确定退出吗?";
                e = e || window.event;
                e.returnValue = msg;
                return msg;
            },
            changeTitle(reback) {
                this.value.title = reback.data.title;
            },
            async init(val) {
                if (!val) {
                    return (this.isShow = false);
                }
                let data = await $.get({_id: val}, "/note/get.do");
                this.tooltip = Tips[data.type];
                this.value = data;
                this.content = data.content;
                if (!data || !data.content) {
                    this.readonly = false;
                }
                this.isShow = true;
                window.addEventListener("beforeunload", this.unload);
                let href = window.location.href;
                if (href.indexOf("docId") > -1) {
                    href = $.setParam("docId", val, href);
                    window.history.replaceState(null, data.title, href);
                } else {
                    href = $.setParam("docId", val, href);
                    window.history.pushState(null, data.title, href);
                }
            },
            edit() {
                this.readonly = !this.readonly;
            },
            nav() {
                this.showNav = !this.showNav;
            },
            async save(content) {
                let param = {
                    _id: this.itemId,
                    content: content
                };
                await $.post(param, "/note/patch.do");
                $.notice("保存完成", "success");
            },
            close() {
                this.debounce.flush();
                window.removeEventListener("beforeunload", this.unload);
                this.$parent.docId = "";
                let url = $.setParam("docId", "");
                window.history.replaceState(null, null, url);
            }
        }
    };
</script>