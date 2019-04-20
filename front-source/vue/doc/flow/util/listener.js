import Crub from "./crub"

export default {
    context: null,
    init: function (context) {
        this.context = context;
    },
    addNode: function (node) {
        Crub.add(node, this.context);
    },
    on: function (type, params) {
        let context = this.context;
        if (context.readonly) {
            return;
        }
        if (type === "nodeMouseover") {
            context.currentNode = params;
            if (context.isDrawLine) {
                return;
            }
            return context.emitTool(true);
        }
        if (type === "lineEvent") {
            return this.lineEvent(params);
        }
    },
    lineEvent: function (params) {
        let context = this.context,
            type = params.type,
            target = params.target;
        if (type === "click") {
            context.line = target;
            return context.emitEditor(true, target);
        }
        if (type === "mouseover") {
            let current = context.line;
            if (current) {
                if (current.data("id") === target.data("id")) {
                    return;
                }
                current.attr({"stroke-width": 1});
            }
            context.line = target;
            return target.attr({"stroke-width": 2});
        }
    },
    keydown: function () {
        let that = this;
        //监听全局事件
        $.on("flowEvt", function (type, params) {
            that.on(type, params);
        });
        $(window).click(function (e) {
            let context = that.context;
            if (context.readonly) {
                return;
            }
            let target = e.target.tagName;
            if (target === "svg") {
                context.emitEditor(false);
                context.emitTool(false);
                if (context.line) {
                    context.line.attr({"stroke-width": 1});
                    context.line = null;
                }
            }
        });
    }
}