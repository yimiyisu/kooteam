<template>
    <div>
        <div class="chapter" v-for="item in value" :key="'nav'+item.id">
            <div class="item" @click="selected(item)" :class="{'active':item.link===current}">
                {{item.title}}
            </div>
            <Nav v-if="item.sons&&item.sons.length>0" :current="current" :value="item.sons"></Nav>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["value", "current"],
        name: "Nav",
        methods: {
            selected: function (item) {
                if (!item.link) {
                    return alert(item.title + "文档尚未创建")
                }
                if (item.link === "folder") {
                    return;
                }
                let param = {
                    event: "doc",
                    data: item.link
                };
                $.emit("chapterEvt", param);
            }
        }
    }
</script>