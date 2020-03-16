<template>
    <div class="btn" @click="trigger">
        <i class="ft icon">&#xe764;</i>{{text}}
        <z-popover v-model="visible">
            <z-employee :max="1" v-model="people"></z-employee>
            <div class="k-detail-operator">
                <z-button plain size="mini" @click.stop="close">取消</z-button>
                <z-button size="mini" type="primary" @click.stop="submit">确定</z-button>
            </div>
        </z-popover>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                thingId: null,
                isOnwer: false,
                hasWatch: false,
                people: null,
                visible: false
            }
        },
        inject: ["getThing"],
        computed: {
            text() {
                if (this.isOnwer) {
                    return "关注人";
                }
                if (this.hasWatch) {
                    return "取消关注";
                }
                return "关注该任务";
            }
        },
        created() {
            let thing = this.getThing(), myUid = zen.user.uid;
            this.thingId = thing._id;
            if (thing.owner === myUid) {
                this.isOnwer = true;
            }
            $.get({thingId: this.thingId}, "/select/thingWatcherByThing.json", function (reback) {
                let data = reback.data;
                if (!data || data.length === 0) {
                    return;
                }
                data.forEach(item => item.uid === myUid && (this.hasWatch = true));
                $.emit("detailWatcher", data, "new");
            }, this);
        },
        methods: {
            trigger() {
                if (this.isOnwer) {
                    return this.visible = true;
                }
                let uid = zen.user.uid;
                if (this.hasWatch) {
                    return $.post({thingId: this.thingId, uid: uid},
                        "/delete/thingWatcherUid.json", function () {
                            this.hasWatch = false;
                            $.emit("detailWatcher", uid, "remove");
                        }, this);
                }
                this.people = uid;
                this.submit();
                this.hasWatch = true;
            },
            close() {
                this.visible = false;
            },
            submit() {
                if (!this.people) {
                    return this.close();
                }
                $.post({thingId: this.thingId, uid: this.people}, "/thing/addWatcher.do", function (reback) {
                    reback.data && $.emit("detailWatcher", reback.data, "add");
                    this.close();
                }, this);
            }
        }
    }
</script>