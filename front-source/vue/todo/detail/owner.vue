<template>
    <dl class="z-left">
        <dt><i class="ft icon h2">&#xe903;</i>负责人：</dt>
        <dd class="k-todo-owner">
            <span class="nick">{{name}}</span>
        </dd>
    </dl>
</template>
<script>
    export default {
        name: "detailOwner",
        data: function () {
            return {
                thing: null,
                name: ""
            }
        },
        inject: ["getThing", "log"],
        mounted: function () {
            let thing = this.getThing();
            let owner = thing.owner;
            if (owner === zen.user.id) {
                return this.name = "我自己";
            }
            $.get({uid: owner}, "/zeto/nick.do", function (reback) {
                this.name = reback.data;
            }, this);
        }
    }
</script>