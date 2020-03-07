export default {
    inject: ["getThing", "log"],
    data() {
        return {
            thing: null
        }
    },
    created() {
        this.thing = this.getThing();
    },
    render() {
        let _ = this, thing = _.thing;
        if (!thing.status) {
            return <div class="btn" on-click={_.doFinish}>
                <i class="ft icon">&#xe6cb;</i>标记已完成
            </div>
        }
        return <div class="btn ft green" on-click={_.doFinish}>
            <i class="ft icon">&#xe6d5;</i>设为未完成
        </div>
    },
    methods: {
        doFinish() {
            let thing = this.thing;
            let status = !!thing.status ? 0 : 1;
            $.post({status: status, _id: thing._id}, "/thing/patch.do", () => {
                thing.status = status;
                if (status === 1) {
                    this.log("完成了这个任务");
                } else {
                    this.log("重新打开了这个任务");
                }
                $.emit("thingUpdate", thing, "status");
            }, this)
        }
    }
}