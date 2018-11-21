const app = getApp();

Component({
    props: {
        _id: "",
        describe: ""
    },
    data: {
        index: 0,
    },

    methods: {
        saveRemark: function (event) {  // 实时保存用户输入的数据
            let describe2 = event.detail.value,
                id = event.target.id,
                params = {_id: id, describe: describe2};
            app.http(params, "/thing/patch.do", function () {
            });
        }
    }
});