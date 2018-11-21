const app = getApp();

Component({
    props: {
        uid: ""
    },
    data: {
        src: ""
    },
    didMount: function () {
        let avator = app.user.avator(this.props.uid);
        this.setData({src: avator});
    },
    methods: {
        onError: function (e) {
            this.setData({src: "https://a.yimiyisu.com/avator.jpg"});
        }
    }
})
;