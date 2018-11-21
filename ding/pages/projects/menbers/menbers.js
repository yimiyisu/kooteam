const app = getApp();

Page({
    data: {
        items: [],
        startX: 0, //开始坐标
        startY: 0,
        projectId: null,
        projectTitle: null,
    },
    onLoad: function (options) {
        this.setData({
            projectId: options.projectId,
            projectTitle: options.projectTitle
        });
    },
    onPullDownRefresh: function () {
        this.loadData(true);
    },
    onShow: function () {
        this.loadData(false);
    },
    loadData: function (isPull) {
        app.http({projectId: this.data.projectId}, "/project/members.do", function (reback) {
            let data = reback.data.data;
            if (isPull) {
                dd.stopPullDownRefresh();
            }
            this.setData({items: data});
        }, this);
    },
    addMember: function () {
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
                if (res.selectedCount < 1) {
                    return dd.alert({content: "请选择项目成员"});
                }
                let ids = [], user;
                for (let i = 0; i < res.users.length; i++) {
                    user = res.users[i];
                    ids.push(user.userId);
                }
                let params = {
                    role: "1",
                    projectId: that.data.projectId,
                    dingUsers: ids.join(",")
                };
                app.http(params, "/project/addUser.do", function (res) {
                    that.loadData(true);
                }, this);
            },
            fail: function (err) {
                dd.alert({content: JSON.stringify(err)})
            }
        });
    },
    //手指触摸动作开始 记录起点X坐标
    touchstart: function (e) {
        //开始触摸时 重置所有删除
        this.data.items.forEach(function (v, i) {
            if (v.isTouchMove)//只操作为true的
                v.isTouchMove = false;
        });
        this.setData({
            startX: e.changedTouches[0].clientX,
            startY: e.changedTouches[0].clientY,
            items: this.data.items
        })
    },
    //滑动事件处理
    touchmove: function (e) {
        let that = this,
            index = e.currentTarget.dataset.index,//当前索引
            startX = that.data.startX,//开始X坐标
            startY = that.data.startY,//开始Y坐标
            touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
            touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
            //获取滑动角度
            angle = that.angle({X: startX, Y: startY}, {X: touchMoveX, Y: touchMoveY});
        that.data.items.forEach(function (v, i) {
            v.isTouchMove = false;
            //滑动超过30度角 return
            if (Math.abs(angle) > 30) return;
            if (i == index) {
                if (touchMoveX > startX) //右滑
                    v.isTouchMove = false;
                else //左滑
                    v.isTouchMove = true;
            }
        });
        //更新数据
        that.setData({
            items: that.data.items
        })
    },
    /**
     * 计算滑动角度
     * @param {Object} start 起点坐标
     * @param {Object} end 终点坐标
     */
    angle: function (start, end) {
        let _X = end.X - start.X,
            _Y = end.Y - start.Y;
        //返回角度 /Math.atan()返回数字的反正切值
        return 360 * Math.atan(_Y / _X) / (2 * Math.PI);
    },
    remove: function (param) {
        app.http(param, "/project/deleteMember.do", function (reback) {
            if (reback.hasError) {
                return dd.showModal({
                    title: "删除失败",
                    content: reback.message,
                    showCancel: false
                });
            }
            this.loadData(false);
        }, this);
    },
    //删除事件
    del: function (e) {
        let data = e.currentTarget.dataset, that = this;
        let param = {
            _id: data.id,
            idx: data.idx
        };
        dd.showModal({
            title: "操作提示",
            content: "确定删除吗？",
            success: function (res) {
                if (res.cancel) {
                    return;
                }
                that.remove(param);
            }
        });
    }
});