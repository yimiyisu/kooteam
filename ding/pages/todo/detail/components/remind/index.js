Component({
    props: {
        title: ""
    },
    /**
     * 组件的初始数据
     */
    data: {
        index: 0,
        priority: [
            {id: "a", name: "重要且紧急"},
            {id: "b", name: "紧急不重要"},
            {id: "c", name: "重要不紧急"},
            {id: "d", name: "不重要不紧急"}
        ],
    },

    /**
     * 组件的方法列表
     */
    methods: {
        save: function (e) {
            console.log(e);
            this.hide();
        },
        priorityChange: function (e) {
            let index = parseInt(e.detail.value);
            this.setData({"index": index});
        },
        hide: function () {
            this.triggerEvent("addEvent", false);
        }
    }
});