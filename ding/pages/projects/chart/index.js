const app = getApp();

Page({
    data: {
        projectId: "",
        stat: {}
    },
    onLoad: function (e) {
        this.setData({projectId: e.projectId});
    },
    onShow: function () {
        app.http({id: this.data.projectId}, "/project/stat.do", function (reback) {
            this.setData({stat: reback.data});
        }, this);
    }
});