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
        data() {
            return {
                list: [],
                serial: ["一", "二", "三", "四", "五", "六", "七", "八", "九", "十",
                    "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九",
                    "二十一", "二十二", "二十三", "二十四", "二十五", "二十六", "二十七", "二十八", "二十九",
                    "三十一", "三十二", "三十三", "三十四", "三十五", "三十六", "三十七", "三十八", "三十九",
                    "四十一", "四十二", "四十三", "四十四", "四十五", "四十六", "四十七", "四十八", "四十九",
                    "五十一", "五十二", "五十三", "五十四", "五十五", "五十六", "五十七", "五十八", "五十九",
                    "l十一", "五十二", "五十三", "五十四", "五十五", "五十六", "五十七", "五十八", "五十九"]
            }
        },
        mounted() {
            let current;
            if (!this.data) {
                return;
            }
            for (let i = 0; i < this.data.length; i++) {
                current = this.data[i];
                current.status && (current.status = false);
                this.list.push(current);
            }
        },
        methods: {
            // 查看章节
            select(item) {
                if (!item.link) {
                    return alert("该文档尚未创建")
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