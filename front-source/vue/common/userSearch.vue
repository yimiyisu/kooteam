<template>
    <div class="k-user-search z-form" :class="{'fixed':fixed}" @click.stop="stop">
        <z-input :value="keyword" name="keyword" placeholder="输入昵称关键字搜索" type="text"></z-input>
        <div>
            <label class="item" v-for="user in users" :key="user.uid" @click="select(user,$event)">
                <z-avator :uid="user.uid"></z-avator>
                <div>{{user.nick}}</div>
            </label>
            <input v-if="name" :name="name" :value="uid" type="hidden"/>
        </div>
        <div v-if="localApp&&loaded&&users.length===0" style="text-align: center">
            <div>没有搜索到相关好友，可以用微信扫描二维码添加好友</div>
            <img width="180" src="//a.yimiyisu.com/kooteam/friend.png"/>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["name", "max", "value", "my", "fixed"],
        data: function () {
            return {
                keyword: "",
                loaded: false,
                uid: "",
                history: {},
                localApp: true,
                users: []
            }
        },
        watch: {
            keyword: function () {
                this.load();
            }
        },
        mounted: function () {
            this.localApp = !!window.localApp;
            let local = window.localStorage["userCache"];
            if (local) {
                this.history = JSON.parse(local);
            }
            for (let id in this.history) {
                let item = {
                    uid: id,
                    nick: this.history[id]
                };
                this.users.push(item);
            }
            if (!this.my) {
                return;
            }
            let my = {
                uid: zen.user.id,
                nick: "我自己"
            };
            this.users.unshift(my);
        },
        methods: {
            stop: function () {
            },
            err: function (e) {
                $(e.currentTarget).attr("src", "https://img.yimiyisu.com/avator.jpg")
            },
            select: function (user, evt) {
                evt.stopPropagation();
                // 增加本地数据缓存
                let target = $(evt.currentTarget), clsName = "selected";
                if (target.hasClass(clsName)) {
                    target.removeClass(clsName);
                    this.uid = "";
                    this.$emit("input", null);
                } else {
                    $(".selected", this.$el).removeClass(clsName);
                    target.addClass(clsName);
                    this.uid = user.uid;
                    if (this.uid !== zen.user.id) {
                        this.history[user.uid] = user.nick;
                    }
                    window.localStorage["userCache"] = JSON.stringify(this.history);
                    this.$emit("input", user);
                }
            },
            load: function () {
                $.http({keyword: this.keyword, size: 6}, "/user/searchFriend.do", function (reback) {
                    if (reback.data) {
                        this.users = reback.data;
                    } else {
                        this.users = [];
                    }
                    this.loaded = true;
                    if (!this.my) {
                        return;
                    }
                    let current = zen.user;
                    let my = {
                        _id: "my",
                        uid: current.id,
                        nick: current.nick
                    };
                    this.users.unshift(my);
                }, this);
            }
        }
    }
</script>