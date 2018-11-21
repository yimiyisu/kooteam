const app = getApp();

Page({
    data: {
        things: []
    },
    onLoad: function () {
        app.http(null, "/select/thingByMyCreate.json", function (res) { // 获取所有things
            this.setData({things: res.data.data});
        }, this);
    }

});