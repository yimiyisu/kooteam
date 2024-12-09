let hasProp = {}.hasOwnProperty;
export default {
    uploadDomain: function () {
        // 私有化本地运行
        if (zen.mode === 3 || zen.mode === 4) {
            return "";
        }
        let uploadDomain = "//bridge.kooteam.com";
        if (zen.env === "daily") {
            uploadDomain = "//bridge.dev.zeto.me";
        }
        return uploadDomain;
    },
    resDomain: function () {
        if (zen.mode === 3 || zen.mode === 4) {
            return "";
        }
        return "//a.yimiyisu.com";
    },
    extend: function (child, parent) {
        for (let key in parent) {
            if (hasProp.call(parent, key)) child[key] = parent[key];
        }

        function ctor() {
            this.constructor = child;
        }

        ctor.prototype = parent.prototype;
        child.prototype = new ctor();
        child.__super__ = parent.prototype;
        return child;
    }
}