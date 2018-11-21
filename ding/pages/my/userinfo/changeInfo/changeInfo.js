const app = getApp();


Page({
    data: {
        userInfo: null,
        nick: null,
        phone: null,
        sex: null,
        changeItem: "",
        items: [{name: '男', value: '1'}, {name: '女', value: '0'}],
    },
    onLoad: function (e) {
        this.setData({changeItem: e.changeItem});
        app.http(null, "/system/my.do", function (reback) {
            if (reback.data) {
                let userInfo = reback.data;
                this.setData({"userInfo": userInfo});
            }
        }, this);
    },
    nickInput: function (option) {
        this.setData({nick: option.detail.value});
    },
    phoneNumInput: function (option) {
        this.setData({phone: option.detail.value});
    },
    sexChange: function (option) {
        this.setData({sex: option.detail.value});
    },
    submit: function () {
        let params = {};
        params["_id"] = this.data.userInfo._id;
        if (this.data.nick !== null) {
            params["nick"] = this.data.nick;
        }
        if (this.data.phone !== null) {
            params["phone"] = this.data.phone;
        }
        if (this.data.sex !== null) {
            params["sex"] = this.data.sex;
        }
        app.http(params, "/patch/user.json", function (res) {
            console.log("修改个人信息 操作结果----" + res.message);
        });
        dd.navigateBack();
    }
})
;