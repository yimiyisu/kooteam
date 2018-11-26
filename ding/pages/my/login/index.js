let app = getApp();

Page({
    data: {
        logining: 2,
        checkId: ""
    },
    onLoad(query) {
        // 页面加载
    },
    onShow() {
        this.author(app.checkId);
    },
    author: function (checkId) {
        if (!checkId) {
            return;
        }
        let user = app.user.get();
        let that = this;
        if (user != null) {
            let url = app.domain + "/ding/login.do";
            this.setData({logining: 2});
            return app.http({checkId: checkId}, url, function (res) {
                let data = res.data;
                // 如果登录失败，则重新开始
                if (data.hasError) {
                    app.user.clean();
                    // return this.author(checkId);
                } else {
                    app.checkId = "";
                }
                dd.redirectTo({url: "/pages/todo/index"});
            }, that);
        }
        dd.getAuthCode({
            success: (res) => {
                that.login(res.authCode, checkId);
                app.checkId = "";
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
            success: function (res) {
                let result = res.data;
                if (result.hasError) {
                    return dd.alert({content: "钉钉授权失败，请稍后再试。"});
                }
                // 更新本地用户key
                app.user.set(result.data);
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
