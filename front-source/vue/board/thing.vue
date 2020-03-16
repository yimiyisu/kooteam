<template>
    <div class="thing" :class="item.quadrant" :now="now" @dblclick="dblclick" @click="detail(item)"
         drag="board">
        <div class="title" :class="{finished:item.status===1}">
            {{item.title}}
        </div>
        <div class="more">
            <span class="status" :class="{'doned':item.status === 1}">{{status}}</span>
            <z-avatar size="small" :uid="item.owner"></z-avatar>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["item", "now"],
        computed: {
            status() {
                return this.item.status === 1 ? "已完成" : "待处理"
            }
        },
        methods: {
            detail(item) {
                $.emit("thingDetail", item._id);
            },
            dblclick(evt) {
                evt.preventDefault();
                evt.stopPropagation();
            }
        }
    }
</script>