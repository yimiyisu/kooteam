<template>
    <div class="k-graph"></div>
</template>
<script>
    export default {
        props: ["value"],
        data: function () {
            return {
                isInited: false,
                themes: {}
            }
        },
        watch: {
            value: function () {
                this.render();
            }
        },
        mounted: function () {
            let win = window;
            win.STENCIL_PATH = '/stencils';
            win.IMAGE_PATH = '/images';
            win.STYLE_PATH = '/styles';
            win.urlParams = {};
            win.mxLoadResources = false;
            win.mxLoadStylesheets = false;
            win.mxBasePath = "/";
            win.mxConstants = {};
            $.lib(["mx/mxClient.js", "mx/viewer.js"], this.render);
        },
        methods: {
            render: function () {
                let that = this;
                that.$el.innerHTML = "";
                if (that.isInited) {
                    that.draw();
                } else {
                    mxUtils.getAll([STYLE_PATH + '/default.xml', STENCIL_PATH + '/basic.xml',
                        STENCIL_PATH + '/flowchart.xml', STENCIL_PATH + '/bpmn.xml', STENCIL_PATH + '/arrows.xml'], function (xhr) {
                        that.themes[Graph.prototype.defaultThemeName] = xhr[0].getDocumentElement();
                        for (let i = 1; i < xhr.length; i++) {
                            that.loadShape(xhr[i]);
                        }
                        that.isInited = true;
                        that.draw();
                    }, function () {
                        alert("加载资源失败");
                    });
                }
            },
            draw: function () {
                let content = this.value.content;
                if (!content) {
                    return;
                }
                content = Graph.decompress(content);
                let xmlDocument = mxUtils.parseXml(content),
                    codec = new mxCodec(xmlDocument),
                    graph = new Graph(this.$el);
                graph.centerZoom = true;
                graph.setTooltips(false);
                graph.setEnabled(false);
                // graph.model.clear();

                // 默认样式，系统默认的形状声明也要加载进来
                let style = graph.getStylesheet().getDefaultVertexStyle();
                style[mxConstants.STYLE_FONTCOLOR] = '#000000';
                style[mxConstants.STYLE_STROKECOLOR] = '#777777';
                style[mxConstants.STYLE_FILLCOLOR] = '#ffffff';

                style = graph.getStylesheet().getDefaultEdgeStyle();
                style[mxConstants.STYLE_STROKECOLOR] = '#777777';
                style[mxConstants.STYLE_FILLCOLOR] = '#ffffff';

                graph.panningHandler.useLeftButtonForPanning = true;
                graph.panningHandler.ignoreCell = true;
                graph.container.style.cursor = 'move';
                graph.setPanning(true);
                // graph.resizeContainer = true;
                graph.resizeContainer = false;
                graph.border = 0;

                codec.decode(xmlDocument.documentElement, graph.getModel());
            },
            loadShape: function (req) {
                var root = req.getDocumentElement();
                var shape = root.firstChild;
                while (shape != null) {
                    if (shape.nodeType == mxConstants.NODETYPE_ELEMENT) {
                        mxStencilRegistry.addStencil(shape.getAttribute('name'), new mxStencil(shape));
                    }
                    shape = shape.nextSibling;
                }
            }
        }
    }
</script>