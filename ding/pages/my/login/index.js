let app = getApp();

Page({
    data: {
        status: "正在登录中...",
        checkId: ""
    },
    onLoad(query) {
        // 页面加载
    },
    onShow() {
        this.author(app.checkId);
        app.checkId = "";
    },
    author: function (checkId) {
        if (!checkId) {
            return;
        }
        let that = this;
        dd.getAuthCode({
            success: (res) => {
                that.login(res.authCode, checkId);
            },
            fail: (err) => {
                dd.alert({content: "err" + JSON.stringify(err)});
            }
        });
    },
    login: function (authCode, checkId) {
        let param = {
            checkId: checkId,
            authCode: authCode
        };
        let url = app.domain + "/ding/login.do";
        dd.httpRequest({
            url: url,
            method: 'POST',
            data: param,
            success: function () {
                dd.redirectTo({url: "/pages/todo/index"});
            },
            fail: function (res) {
            },
            complete: function (res) {
                dd.hideLoading();
            }
        });
    }
});
