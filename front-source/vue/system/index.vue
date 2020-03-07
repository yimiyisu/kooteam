<template>
    <component :is="name" :value="value"></component>
</template>
<script>
    import skin from "./components/skin"
    // import things from "./components/things"
    import set from "./components/set"
    import thingList from './components/thingList'
    import invite from "./components/invite"
    import user from "./components/user"

    export default {
        props: ["name", "value"],
        components: {skin, set, thingList, invite, user}
    }
</script>