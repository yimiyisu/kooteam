const app = getApp();

Page({
    data: {
        projectTitle: "",
        friends: {},
        projectMenbers: {},
        friendsInfo: [],
        selectedMenber: [],
        projectId: null,
    },
    onLoad: function () {
        app.http(null, "/select/friend.json", function (res) {
            if (res.data) {
                this.setData({"friends": res.data.data});
                this.setData({"friendsInfo": res.data.data});
            }
        }, this)
    },
    bindProjectTitle: function (e) {
        this.setData({"projectTitle": e.detail.value})
    },
    userSelector: function () {
        if (!this.data.projectTitle) {
            return dd.alert({content: "项目名称不能为空！"});
        }
        let user = app.user.get(), that = this;
        dd.complexChoose({
            title: "请选择项目成员",            //标题
            multiple: true,            //是否多选
            limitTips: "最多只能选择10个",          //超过限定人数返回提示
            maxUsers: 10,            //最大可选人数
            pickedUsers: [],            //已选用户
            pickedDepartments: [],          //已选部门
            disabledUsers: [],            //不可选用户
            disabledDepartments: [],        //不可选部门
            requiredUsers: [],            //必选用户（不可取消选中状态）
            requiredDepartments: [],        //必选部门（不可取消选中状态）
            appId: user.appId,              //微应用的Id
            responseUserOnly: true,        //返回人，或者返回人和部门
            startWithDepartmentId: 0,   // 0表示从企业最上层开始
            success: function (res) {
                dd.alert({content: JSON.stringify(res)});
                if (res.selectedCount < 1) {
                    return dd.alert({content: "请选择项目成员"});
                }
                let ids = [], user;
                for (let i = 0; i < res.users.length; i++) {
                    user = res.users[i];
                    ids.push(user.userId);
                }
                dd.alert({content: JSON.stringify(ids)});
                let params = {
                    title: that.data.projectTitle,
                    dingUsers: ids.join(",")
                };
                app.http(params, "/project/create.do", function (res) {
                    console.log(res);
                    debugger
                    dd.navigateTo({
                        url: "/pages/projects/detail?projectId=" + res.data
                    });
                }, this);
            },
            fail: function (err) {
                dd.alert({content: JSON.stringify(err)})
            }
        })
    }
});