<template>
    <z-popover v-model="visible" trigger="click">
        <z-employee :max="1" @input="change"></z-employee>
        <div class="k-detail-operator">
            <z-button plain size="mini" @click="close">取消</z-button>
            <z-button size="mini" type="primary" @click="submit">确定</z-button>
        </div>
        <template slot="reference">
            <div class="btn">
                <i class="ft icon">&#xe6fd;</i>负责人
            </div>
        </template>
    </z-popover>
</template>
<script>
    export default {
        data() {
            return {
                owner: null,
                nick: null,
                visible: false
            }
        },
        inject: ["getThing", "log"],
        methods: {
            close() {
                this.visible = false;
            },
            change(uid, users) {
                this.owner = uid;
                users && (this.nick = users.text);
            },
            submit() {
                let thing = this.getThing();
                if (thing.owner === this.owner) {
                    return $.notice("不能转给同一个人", "error");
                }
                $.post({_id: thing._id, owner: this.owner}, '/thing/patch.do', () => {
                    thing.owner = this.owner;
                    $.emit("thingUpdate", thing, "owner");
                    this.nick && this.log("把负责人改为" + this.nick);
                    this.close();
                }, this)
            }
        }
    }
</script>