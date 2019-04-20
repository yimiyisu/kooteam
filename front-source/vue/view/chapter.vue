<template>
    <div>
        <div class="chapter" v-for="(item,idx) in list" :key="item.id">
            <div class="item" @click="select(item)" :class="{'active':item.link===current}">
                <i v-if="item.link==='folder'"
                   class="folder z-icon" :class="{'hide':item.status===false}"></i>
                <div class="serial">
                    <i v-if="son">{{idx+1}}</i>
                    <span v-else>{{serial[idx]}}</span>
                </div>
                {{item.title}}
            </div>
            <Chapter :son="true" v-if="item.status!==false&&item.sons&&item.sons.length>0"
                     :current="current" :data="item.sons"></Chapter>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["data", "current", "son"],
        name: "Chapter",
        data: function () {
            return {
                list: [],
                serial: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
                    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
                    "三十一", "三十二", "三十三", "三十四", "三十五", "三十六", "三十七", "三十八", "三十九", "四十"]
            }
        },
        mounted: function () {
            let cuurent;
            if (!this.data) {
                return;
            }
            for (let i = 0; i < this.data.length; i++) {
                cuurent = this.data[i];
                if (cuurent.status === true) {
                    cuurent.status = false;
                }
                this.list.push(cuurent);
            }
        },
        methods: {
            // 查看章节
            select: function (item) {
                if (!item.link) {
                    return alert(item.title + "文档尚未创建")
                }
                if (item.link === "folder") {
                    return $.emit("toggle", item.id);
                }
                $.emit("load", item.link);
                $.scrollTop(0);
            }
        }
    }
</script>