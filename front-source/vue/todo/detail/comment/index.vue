<template>
    <div class="k-thing-comment">
        <z-row>
            <z-col :span="1"><span class="ft icon h1">&#xe753;</span></z-col>
            <z-col :span="23">
                <div class="title">
                    <strong class="ft hover" @click="isLog=false">评论</strong>
                    <strong class="ft hover" :class="{'active':isLog}" @click="isLog=true">操作记录</strong>
                </div>
            </z-col>
        </z-row>
        <List v-show="!isLog"/>
        <Log v-if="isLog"/>
    </div>
</template>
<script>
    import List from "./list"
    import Log from "./log"

    export default {
        name: "detailComment",
        props: ["value"],
        components: {List, Log},
        data: function () {
            return {
                isLog: false
            }
        }
    }
</script>