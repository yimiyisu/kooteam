<template>
    <div>
        <Finish/>
        <Priority/>
        <Owner/>
        <Plan/>
        <Remind/>
        <Attach/>
        <Watcher/>
        <Archive/>
        <Remove/>
    </div>
</template>
<script>
    import Attach from "./attach"
    import Watcher from "./watcher"
    import Owner from "./owner"
    import Plan from "./plan"
    import Priority from "./priority"
    import Todo from "./todo"
    import Finish from "./finish"
    import Remind from './remind'
    import Remove from "./remove"
    import Archive from "./archive"

    export default {
        name: "actions",
        components: {Attach, Watcher, Owner, Plan, Priority, Todo, Finish, Remind, Archive, Remove}
    }
</script>