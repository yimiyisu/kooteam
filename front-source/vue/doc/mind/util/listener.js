import Crub from "./crub"

export default {
    context: null,
    init: function (context) {
        this.context = context;
    },
    // 监听事件
    on: function (type, params) {
        if (type === "addNode") {
            return Crub.add(params, this.context);
        }
        if (type === "removeNode") {
            Crub.remove(this.context);
        }
        if (type === "nodeEvent") {
            this.nodeEvent(params);
        }
    },
    nodeEvent: function (params) {
        let context = this.context, target = params.target, type = params.type;
        let nodeId = target.id;
        if (!nodeId) {
            return;
        }
        // 数据校验
        if (context.readonly && (type === "click" || type === "dblclick")) {
            return;
        }
        if (type === "click") {
            if (context.current) {
                if (context.current.id === nodeId) {
                    return;
                }
                context.current.attr({"stroke-width": 1, "fill-opacity": 0.15});
            }
            return context.current = target;
        }
        if (type === "mouseover") {
            context.current = target;
            context.emitTool(true);
            return target.attr({"stroke-width": 2, "fill-opacity": 0.1});
        }
        if (type === "mouseout") {
            return target.attr({"stroke-width": 1, "fill-opacity": 0.15});
        }
        if (type === "dblclick") {
            if (!target.id) {
                return;
            }
            context.current = target;
            return context.emitEditor(true);
        }
    },
    keydown: function (code, e) {
        let context = this.context;
        if (context.current === null || context.readonly) {
            return;
        }
        let isSon = true;
        debugger;
        if (code === 13) {// enter键添加同级
            if (e.ctrlKey || e.metaKey) {// 组合键，算子级
                isSon = false;
            }
        }
        if (code === 9) {// tab键添加子级
            isSon = false;
        }
        // if (code === 8) {
        //     Crub.remove(context);
        //     return context.save();
        // }
        Crub.add(isSon, context);
    },
    // 只在页面第一次加载时刷新一次
    keyboard: function () {
        let that = this;
        $.on("mindEvt", function (type, params) {
            that.on(type, params);
        });
        // $(window).click(function (e) {
        //     that.context.emitTool(false);
        //     return that.context.emitEditor(false);
        // });
        // $(window).keydown(function (e) {
        //     let code = e.keyCode;
        //     if (code !== 13 && code !== 9) {
        //         return;
        //     }
        //     e.preventDefault();
        //     e.stopPropagation();
        //     that.keydown(code, e);
        // });
    }
}