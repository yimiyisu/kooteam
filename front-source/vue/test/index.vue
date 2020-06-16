<template>
    <z-navmenu :data="data"></z-navmenu>
</template>
<script>
    export default {
        data() {
            return {
                data: [{
                    icon: "el-icon-menu",
                    text: "工作台",
                    name: "hello",
                    childs: [{
                        text: "测试以",
                        href: "看看吧"
                    }]
                }]
            }
        }
    }
</script>