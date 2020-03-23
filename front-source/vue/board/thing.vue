<template>
    <div class="thing" :class="item.quadrant" :now="now" @dblclick="dblclick" @click="detail(item)"
         drag="board">
        <div class="title" :class="{finished:item.status===1}">
            {{item.title}}
        </div>
        <div class="more">
            <span class="status" :class="status"></span>
            <z-avatar size="small" :uid="item.owner"></z-avatar>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["item", "now"],
        computed: {
            status() {
                let item = this.item;
                if (item.status === 1) {
                    return "doned";
                }
                if (item.end && item.end < this.now) {
                    return "overtime"
                }
                return ""
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