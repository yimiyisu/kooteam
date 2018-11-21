const app = getApp();

Component({
    props: {
        title: "",
        projectId: "",
    },
    data: {
        index: 0,
        priority: [
            {id: "a", name: "重要且紧急"},
            {id: "b", name: "紧急不重要"},
            {id: "c", name: "重要不紧急"},
            {id: "d", name: "不重要不紧急"}
        ],
        member: 0,
        members: [],
        todoTitle: ""
    },
    didMount: function () {
        if (!this.props.projectId) {
            return;
        }
        app.http({projectId: this.props.projectId}, "/project/members.do", function (reback) {
            let data = reback.data;
            this.setData({members: data});
        }, this);
    },
    methods: {
        save: function () {
            let params = {};
            let userInfo = app.user.get();
            if (!this.data.todoTitle) {
                return;
            }
            params["quadrant"] = this.data.priority[this.data.index].id;
            params["title"] = this.data.todoTitle;
            if (this.data.members.length > 0) {
                let user = this.data.members[this.data.member];
                params["owner"] = user._id;
            } else {
                params["owner"] = userInfo.uid;
            }
            app.http(params, "/thing/put.do", function (res) {
                this.hide(res.data);
            }, this);
        },
        memberChange: function (e) {
            let index = parseInt(e.detail.value);
            this.setData({member: index});
        },
        priorityChange: function (e) {
            let index = parseInt(e.detail.value);
            this.setData({"index": index});
        },
        todoTitle: function (e) {
            this.data.todoTitle = e.detail.value;
        },
        hide: function (item) {
            let parent = this.$page;
            parent.setData({isAdding: false});
            if (!item.timeStamp) {
                parent.addEvent(item);
            }
        }
    }
});