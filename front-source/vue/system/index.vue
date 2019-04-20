<template>
    <component :is="name" :value="value"></component>
</template>
<script>
    import skin from "./components/skin"
    import logout from "./components/logout"
    import things from "./components/things"
    import set from "./components/set"

    export default {
        props: ["name", "value"],
        components: {skin, logout, things, set}
    }
</script>