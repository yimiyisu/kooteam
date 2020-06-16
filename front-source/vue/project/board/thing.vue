<template>
    <div class="thing" :class="item.quadrant" @dblclick="dblclick" @click="detail(item)" drag="board">
        <div class="title" :class="{finished:item.status===1}">{{item.title}}</div>
        <div class="more">
            <k-thing-status class="status" :value="item"></k-thing-status>
            <z-avatar size="small" :uid="item.owner"></z-avatar>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["item"],
        methods: {
            detail(item) {
                $.emit("thingDetail", item._id);
            },
            dblclick(evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }
        }
    };
</script>