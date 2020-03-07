<template>
    <dl class="z-left" v-if="users.length>0">
        <dt><i class="ft icon h2">&#xe90d;</i>关注的人：</dt>
        <dd class="k-todo-watcher">
            <z-tag size="small" type="warning" closable effect="plain" v-for="watcher in users" :key="watcher._id"
                   @close="remove(watcher._id)">
                <z-nick :uid="watcher.uid"></z-nick>
            </z-tag>
        </dd>
    </dl>
</template>
<script>
    export default {
        name: "detailFollw",
        data() {
            return {
                users: [],
                thingId: null
            }
        },
        inject: ["getThing", "log"],
        mounted() {
            $.on("detailWatcher", this.update);
        },
        methods: {
            update(data, action) {
                if (action === "new") {
                    return this.users = data;
                }
                if (action === "add") {
                    return this.users.push(data);
                }
                if (action === "remove") {
                    let user, i = 0;
                    for (; i < this.users.length; i++) {
                        user = this.users[i];
                        if (user._id === data || user.uid === data) {
                            this.users.splice(i, 1);
                            break;
                        }
                    }
                }
            },
            remove(id) {
                let that = this;
                $.confirm("确定删除？", function () {
                    $.post({_id: id}, "/delete/thingWatcher.json", function () {
                        that.update(id, "remove");
                    });
                });
                return true;
            }
        }
    }
</script>