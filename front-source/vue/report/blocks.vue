<template>
    <div class="blocks">
        <div class="block-item" v-for="item in items" :key="item.name" :data-name="item.name">{{item.title}}</div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                items: [
                    {title: "已完成的事情", name: "keep"},
                    {title: "遇到的问题", name: "promblem"},
                    {title: "准备的尝试", name: "try"},
                    {title: "未完成的事情", name: "delay"},
                    {title: "下次计划", name: "plan"},
                    {title: "心得总结", name: "summary"}
                ]
            }
        }
    }
</script>