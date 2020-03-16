<template>
    <dl class="z-left">
        <dt><i class="ft icon h2">&#xe903;</i>负责人：</dt>
        <dd class="k-todo-owner">
            <z-nick :uid="thing.owner"></z-nick>
        </dd>
    </dl>
</template>
<script>
    export default {
        name: "detailOwner",
        data() {
            return {
                thing: null
            }
        },
        inject: ["getThing", "log"],
        created() {
            this.thing = this.getThing();
        }
    }
</script>