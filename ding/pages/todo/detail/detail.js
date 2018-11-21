//获取应用实例
const app = getApp();

Page({
    data: {
        thing: {},          // 事件所有数据
        nick: "我自己",
        priority: "",       // 优先级
        end: "",            // 结束时间
        isFinished: false,     // false或true
        showArea: true,
        projectTitle: ""
    },
    onLoad: function (options) {
        app.http({"_id": options._id}, "/thing/get.do", function (res) {  // 根据id查询事件详情
            let resultData = res.data;
            let isFinished = resultData.status === 1;
            this.setData({
                thing: resultData,
                isFinished: isFinished,
                priority: resultData.quadrant
            });
        }, this);
    },
    statusChange: function () {
        let _id = this.data.thing._id, status = this.data.thing.status;
        let params = {};
        params["_id"] = _id;
        params["status"] = 0;
        if (status === 0) {
            params["status"] = 1;
        }
        app.http(params, "/thing/patch.do", function () {
            this.setData({"isFinished": !this.data.isFinished});
        }, this);
    },
    hideEvent: function (event) {
        this.setData({showArea: event.detail});
    },
    saveContent: function (evt) {
        let params = {};
        debugger
        params["_id"] = this.data.thing._id;
        params["title"] = evt.detail.value;
        app.http(params, "/thing/patch.do", function (res) {
        }, this);
    },
    priorityChange: function (option) {
        this.setData({priority: option.detail});
    },
    endDataChange: function (option) {
        this.setData({end: option.detail});
    }
});