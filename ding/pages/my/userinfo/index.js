const app = getApp();


Page({
    data: {
        userInfo: null,
        _id: null,
        nick: "",
        userImg: "",
        actionSheetHidden: false,
        avator: null,
    },
    onShow: function () {
        app.http(null, "/system/my.do", function (reback) {
            let data = reback.data;
            this.setData({"userInfo": data});
        }, this);
    },
    changeAvatar: function () {
        let that = this;
        dd.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片，只有一张图片获取下标为0
                let tempFilePaths = res.tempFilePaths[0];
                that.setData({
                    userImg: tempFilePaths,
                    actionSheetHidden: !that.data.actionSheetHidden
                });
                that.uploadFile('https://bridge.yimiyisu.com/upload/image.do', tempFilePaths, 'file', {}, function (res) {
                    console.log(res);
                    if (null != res) {
                        that.setData({userImg: res});
                        // 保存新的头像路径到数据库
                        let params = {};
                        params["_id"] = that.data.userInfo._id;
                        params["avator"] = tempFilePaths;
                        app.http(params, "/patch/user.json", function () {
                            that.setData({avator: tempFilePaths});
                        })
                    } else {
                        // 显示消息提示框
                        dd.showToast({
                            content: '上传失败',
                            type: 'error',
                            duration: 2000
                        })
                    }
                }, this);
            }
        })
    },
    //上传文件
    uploadFile: function (url, filePath, name, formData, cb) {
        console.log('a=' + filePath);
        dd.uploadFile({
            url: url,
            filePath: filePath,
            name: name,
            header: {
                'content-type': 'multipart/form-data'
            }, // 设置请求的 header
            formData: formData, // HTTP 请求中其他额外的 form data
            success: function (res) {
                if (res.statusCode == 200 && !res.data.result_code) {
                    return typeof cb == "function" && cb(res.data)
                } else {
                    return typeof cb == "function" && cb(false)
                }
            },
            fail: function () {
                return typeof cb == "function" && cb(false)
            }
        })
    },

    changeNick: function () {
        dd.navigateTo({
            url: "./changeInfo/changeInfo?changeItem=nick",
        });
    },
    changePhone: function () {
        dd.navigateTo({
            url: "./changeInfo/changeInfo?changeItem=phone",
        });
    },
    changeSex: function () {
        dd.navigateTo({
            url: "./changeInfo/changeInfo?changeItem=sex",
        });
    }
})
;