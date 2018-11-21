const app = getApp();
Component({
    props: {
        thing: {}
    },
    data: {
        users: []
    },
    methods: {
        show: function () {
            let that = this, user = app.user.get();
            dd.complexChoose({
                title: "请选择项目成员",            //标题
                multiple: true,            //是否多选
                limitTips: "只能选择一个人",          //超过限定人数返回提示
                maxUsers: 1,            //最大可选人数
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
                    if (res.selectedCount < 1) {
                        return dd.alert({content: "请选择项目成员"});
                    }
                    that.save(res.users[0]);
                },
                fail: function (err) {
                    dd.alert({content: JSON.stringify(err)})
                }
            })
        },
        save: function (user) {
            let thing = this.props.thing;
            thing.nick = user.nick;
            this.setData({thing: thing, showDialog: false});
            if (user.userId === thing.owner) {
                return;
            }
            let params = {
                _id: thing._id,
                owner: user.userId
            };
            app.http(params, "/thing/patch.do", function (reback) {
            });
            // 同步到数据库
        }
    }
});