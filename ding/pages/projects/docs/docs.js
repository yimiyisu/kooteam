const app = getApp();

Page({
    data: {
        docs: []
    },
    onLoad: function () {
        app.http(null, "/select/noteByUid.json", function (res) {
            let docTemp = res.data;
            if (docTemp) {
                this.setData({"docs": docTemp.data})
            }
        }, this);
    },


});