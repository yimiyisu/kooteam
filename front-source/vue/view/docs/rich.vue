<template>
    <div class="wrap">
        <div class="article-body" v-html="value.content"></div>
    </div>
</template>
<script>
    export default {
        name: "docRich",
        props: ["value"]
    }
</script>