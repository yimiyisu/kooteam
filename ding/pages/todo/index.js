//获取应用实例
const app = getApp();

Page({
    data: {
        isAdding: false,
        total: 1,
        indexs: {"a": 0, "b": 1, "c": 2, "d": 3},
        things: [{
            quadrant: "a",
            title: "重要且紧急",
            sons: []
        }, {
            quadrant: "b",
            title: "紧急不重要",
            sons: []
        }, {
            quadrant: "c",
            title: "重要不紧急",
            sons: []
        }, {
            quadrant: "d",
            title: "不重要不紧急",
            sons: []
        }]
    },
    onPullDownRefresh: function () {
        this.refreshThing(true);
    },
    onLoad: function () {
        if (app.checkId) {
            return dd.navigateTo({
                url: "/pages/my/login/index"
            });
        }
        this.refreshThing();
    },
    tapAdd: function () {
        this.setData({isAdding: true});
    },
    addEvent: function (item) {
        if (item.timeStamp) {
            return this.setData({isAdding: false});
        }
        let things = this.data.things,
            idx = this.data.indexs[item.quadrant];
        if (idx === undefined) {
            idx = 1;
        }
        things[idx].sons.unshift(item);
        this.setData({isAdding: false, things: things});
    },
    refreshThing: function (isPull) {
        app.http(null, "/thing/latest.do", function (res) { // 获取所有things
            if (isPull) {
                dd.stopPullDownRefresh();
            }
            let resultData = res.data.data, item, idx, things = this.data.things;
            for (let i = 0; i < things.length; i++) {
                things[i].sons = [];
            }
            if (!resultData || resultData.length === 0) {
                this.setData({total: 0});
                return;
            }
            this.total = resultData.length;
            for (let i = 0; i < resultData.length; i++) {
                item = resultData[i];
                if (!item.quadrant) {
                    things[1].sons.push(item);
                    continue;
                }
                idx = this.data.indexs[item.quadrant];
                things[idx].sons.push(item);
            }
            let user = app.user.get();
            this.setData({things: things});
        }, this);
    }
});