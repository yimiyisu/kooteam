<template>
    <component :is="name" :value="value"></component>
</template>
<script>
    import action from "./action"

    export default {
        props: ["name", "value"],
        components: {action}
    }
</script>