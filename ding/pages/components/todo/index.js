const app = getApp();

Component({
    props: {
        thing: {}
    },
    data: {
        isFinished: false
    },
    didMount: function () {
        if (this.props.thing.status === 1) {
            this.setData({isFinished: true});
        }
    },
    methods: {
        detail: function () {
            dd.navigateTo({
                url: '/pages/todo/detail/detail?_id=' + this.props.thing._id,
            })
        },
        statusChange: function () {
            let thing = this.props.thing;
            let status = thing.status, params = {};
            params["_id"] = thing._id;
            params["status"] = 0;
            if (status === 0) {
                params["status"] = 1;
            }
            params["projectId"] = thing.projectId;
            app.http(params, "/thing/patch.do", function (res) {
                thing.status = params["status"];
                this.setData({"isFinished": !this.data.isFinished});
            }, this);
        },
    }
});