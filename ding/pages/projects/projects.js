const app = getApp();

Page({
    data: {
        projects: ""
    },
    onLoad: function (options) {

    },
    onShow: function () {
        //根据用户ID 查询用户相关的项目，包含两种 自己创建的项目 自己是项目成员
        app.http(null, "/project/my.do", function (res) {
            let temp = res.data;
            if (temp) {
                this.setData({"projects": temp.data});
            }
        }, this);
    },
    detail: function (e) {
        let projectId = e.currentTarget.dataset.projectId;
        let title = e.currentTarget.dataset.title;
        dd.navigateTo({
            url: '../projects/detail/index?projectId=' + projectId + '&title=' + title,
        })
    },
    search: function () {

    },
    add: function (e) {
        dd.navigateTo({
            url: "../projects/add/index",
        })
    },
});