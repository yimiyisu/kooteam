const app = getApp();

Component({
    props: {
        priority: "",
        _id: ""
    },
    data: {
        index: 0,
        priorityArr: [
            {id: "a", name: "重要且紧急"},
            {id: "b", name: "紧急不重要"},
            {id: "c", name: "重要不紧急"},
            {id: "d", name: "不重要不紧急"}
        ],
    },

    methods: {
        priorityChange: function (e) {
            let index = parseInt(e.detail.value),
                tempPriority = this.data.priorityArr[index].id,
                params = {};
            this.setData({"index": index});
            params["_id"] = e.target.id;
            params["quadrant"] = tempPriority;
            app.http(params, "/thing/patch.do", function (res) {
            }, this);
            this.triggerEvent('priorityChange', tempPriority);
        },
    }
});