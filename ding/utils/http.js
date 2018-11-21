// import User from "./utils/user"

function login(data, url, callback, context) {
    let app = getApp();
    dd.getAuthCode({
        success: (res) => {
            let param = {
                authCode: res.authCode
            };
            dd.httpRequest({
                url: app.domain + '/ding/login.do',
                method: 'POST',
                data: param,
                success: (res) => {
                    app.user.set(res.data.data);
                    http(data, url, callback, context);
                },
                fail: (res) => {
                },
                complete: (res) => {
                    dd.hideLoading();
                }
            });
        },
        fail: (err) => {
            dd.alert({content: "err" + JSON.stringify(err)});
        }
    });
}

// 该函数会验证用户登录状态
const http = function (data, url, callback, context) {
    let app = getApp();
    if (url.indexOf("http") === -1) {
        url = app.domain + url;
    }
    let user = app.user.get();
    if (!user || !user.uid) {
        return login(data, url, callback, context);
    }
    let cookie = "uid=" + user.uid + ";ukey=" + user.ukey;
    if (!data) {
        data = {};
    }
    dd.httpRequest({
        url: url, //仅为示例，并非真实的接口地址
        data: data,
        method: 'POST',
        dataType: 'json',
        headers: {
            "Cookie": cookie,
            "content-type": "application/x-www-form-urlencoded"
        },
        fail: function (res) {
            dd.alert({content: JSON.stringify(res)});
        },
        success: function (res) {
            let result = res.data;
            if (result.action === 4) {
                return login(data, url, callback, context);
            }
            callback.call(context, result);
        },
        complete: function () {
            dd.hideLoading();
        }
    })
};

module.exports = http;
