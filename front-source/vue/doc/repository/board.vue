<template>
    <div v-if="isShow" class="k-doc-board">
        <dl class="rep-nav z-left">
            <dt class="active" @click="close">
                <i class="z-icon">&#xe5d9;</i>
            </dt>
            <dt @click="nav" v-tip="'文库目录'">
                <i class="z-icon">&#xe8fe;</i>
            </dt>
            <!--<dt v-tip="'编辑文档'" @click="edit" :class="{'on':!readonly}">-->
            <!--<i class="z-icon">&#xe22b;</i>-->
            <!--</dt>-->
            <dt v-show="!readonly" @click="saved" v-tip="'保存文档'">
                <i class="z-icon">&#xe161;</i>
            </dt>
            <dt v-tip="'阅读模式'">
                <a :href="'/view.html?id='+itemId" target="_blank">
                    <i class="z-icon">&#xe8f4;</i>
                </a>
            </dt>
            <dd class="z-noselect">
                {{tooltip}}
            </dd>
        </dl>
        <div class="success">{{tipMsg}}</div>
        <component :is="name" :readonly="readonly" :emitSave="emitSave" v-model="value"></component>
        <div class="doc-nav" :class="{'show':showNav || value.type === 4}">
            <i class="z-icon close hover" @click="nav" v-show="showNav">&#xe14c;</i>
            <Nav :value="nodes" :current="itemId"></Nav>
        </div>
    </div>
</template>
<script>
    import Editor from "../word/index"
    import Mind from "../mind/index"
    // import Flow from "../flow/index"
    import Graph from "../graph/index"
    import Nav from "./nav"

    const ComponentName = {1: "Editor", 2: "Mind", 3: "Flow", 5: "Graph"};
    const Tips = {
        1: "按Ctr+S 立即保存文档",
        2: "选中节点，按enter键添加子节点，tab键添加同级节点",
        3: "选中节点，双击进入编辑模式，按del键删除节点",
        5: ""
    };
    export default {
        props: ["itemId", "nodes"],
        components: {Editor, Mind, Nav, Graph},
        data: function () {
            return {
                isShow: false,
                showNav: false,
                readonly: false,
                emitSave: false,
                timerId: 1,
                tipMsg: "",
                value: null,
                tooltip: "",
                name: "Editor"
            }
        },
        watch: {
            itemId: function (val) {
                // this.readonly = true;
                this.init(val);
            }
        },
        mounted: function () {
            this.init(this.itemId);
        },
        methods: {
            init: function (val) {
                if (!val) {
                    return this.isShow = false;
                }
                $.http({_id: val}, "/note/get.do", function (reback) {
                    $.lockBody(true);
                    let data = reback.data;
                    this.name = ComponentName[data.type];
                    this.tooltip = Tips[data.type];
                    this.value = data;
                    if (!data || !data.content) {
                        this.readonly = false;
                    }
                    this.isShow = true;
                    let href = window.location.href;
                    if (href.indexOf("docId") > -1) {
                        href = $.setParam("docId", val, href);
                        window.history.replaceState(null, data.title, href);
                    } else {
                        href = $.setParam("docId", val, href);
                        window.history.pushState(null, data.title, href);
                    }
                }, this);
            },
            edit: function () {
                this.readonly = !this.readonly;
            },
            saved: function () {
                if (this.name === "Graph") {
                    let iframe = document.getElementById("J_graphIframe");
                    iframe.contentWindow.postMessage({type: "save"}, "/");
                    return;
                }
                this.emitSave = true;
            },
            nav: function () {
                this.showNav = !this.showNav;
            },
            close: function () {
                this.$parent.docId = "";
                let url = $.setParam("docId", "");
                $.lockBody(false);
                window.history.replaceState(null, null, url);
            },
            tip: function (message) {
                this.tipMsg = message;
                this.emitSave = false;
                clearTimeout(this.timerId);
                let that = this;
                this.timerId = setTimeout(function () {
                    that.tipMsg = "";
                }, 5000);
            }
        }
    }
</script>