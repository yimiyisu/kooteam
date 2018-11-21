const app = getApp();
Component({
    props: {
        end: "",
        _id: ""
    },
    data: {
        endTime: "",
    },
    methods: {
        dateChange: function (e) {
            let endTime = e.detail.value,
                _id = e.target.id,
                params = {};
            let date = new Date(endTime);
            this.triggerEvent('endDataChange', endTime);
            this.setData({"end": endTime});
            params["_id"] = _id;
            params["end"] = date.getTime() / 1000;
            app.http(params, "/thing/patch.do", function (res) {
            }, this);
        },
    }
});