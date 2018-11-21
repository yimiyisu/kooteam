const app = getApp();

Page({
    data: {
        isAdding: false,
        projectId: "",
        things: [],
        title: "",
        project: "",
    },
    onLoad: function (e) {
        if (e.projectId) {
            this.setData({"projectId": e.projectId});
        }
        if (e.title) {
            this.setData({"title": e.title});
        }
    },
    onShow: function () {
        this.refreshThing();
    },
    onPullDownRefresh: function () {
        this.refreshThing(true);
    },
    tapAdd: function () {
        this.setData({isAdding: true});
    },
    doc: function (e) {
        dd.navigateTo({
            url: "../docs/docs",
        });
    },
    member: function (e) {
        dd.navigateTo({
            url: "../menbers/menbers?projectId=" + this.data.projectId,
        });
    },
    chart: function () {
        dd.navigateTo({
            url: "../chart/index?projectId=" + this.data.projectId,
        });
    },
    addEvent: function (item) {
        if (item.timeStamp) {
            return this.setData({isAdding: false});
        }
        let things = this.data.things;
        things.unshift(item);
        this.setData({isAdding: false, things: things});
    },
    refreshThing: function (isPull) {
        let params = {};
        this.setData({"isAdding": false});
        params["projectId"] = this.data.projectId;
        app.http(params, "/select/thingByProjectId.json", function (res) {
            let temp = res.data;
            this.setData({"things": temp.data});
            if (isPull) {
                dd.stopPullDownRefresh();
            }
        }, this);
    }
});