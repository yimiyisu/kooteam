const app = getApp();

Page({
    data: {
        things: [],
        status: "0",
        uid: "",
        todoClass: "active",
        finishedClass: "none"
    },
    onShow: function () {
        this.loadData(0);
    },
    loadData: function (status) {
        app.http({status: status}, "/select/thing.json", function (res) { // 获取所有things
            let resultData = res.data;
            if (resultData.data) {
                this.setData({things: resultData.data});
            }
        }, this);
    },
    filter: function (e) {
        let status = e.currentTarget.dataset.type;
        if (status === this.data.status) {
            return;
        }
        this.loadData(status);
        if (status === "0") {
            this.setData({
                status: "0",
                todoClass: "active",
                finishedClass: "none"
            });
        } else {
            this.setData({
                status: "1",
                todoClass: "none",
                finishedClass: "active"
            });
        }

    }
});