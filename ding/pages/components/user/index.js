const app = getApp();

Component({
    props: {
        uid: "",
        nick: ""
    },
    data: {
        isSelected: false,
    },
    methods: {
        selecteMembers: function (e) {
            let params = {}, user = this.data;
            params["userId"] = user.uid;
            params["nick"] = user.nick;
            params["avator"] = app.user.avator(user.uid);
            this.setData({"isSelected": !this.data.isSelected});
            if (this.data.isSelected) {
                this.triggerEvent("selectMenber", params);
            } else {
                this.triggerEvent("cancelSelect", params);
            }
        }
    }
})
;