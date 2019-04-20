<template>
    <component :is="name" :value="value"></component>
</template>
<script>
    import login from "./components/login"
    import employee from "./components/employee"

    export default {
        props: ["name", "value"],
        components: {login, employee}
    }
</script>