const app = getApp();

Page({
    data: {
        items: []
    },
    onLoad: function () {
        app.http(null, "/select/message.json", function (res) {
            let items = res.data.data;
            for (let i = 0; i < items.length; i++) {
                items[i].date = app.util.idate(items[i]._id);
            }
            this.setData({items: items});
        }, this);
    }
});