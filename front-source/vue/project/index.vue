<template>
    <component :is="com" :projectId="projectId" v-model="value"/>
</template>
<script>
    import CategoryManager from "./common/categoryManager"
    import CategorySelector from "./common/categorySelector"
    import SectionSelector from "./common/sectionSelector"
    import Add from "./add"
    import Proccess from "./process"

    export default {
        props: ["name", "projectId", "value"],
        computed: {
            com() {
                let name = this.name;
                if (name === "add") {
                    return Add;
                }
                if (name === "process") {
                    return Proccess;
                }
                if (name === "CategoryManager") {
                    return CategoryManager;
                }
                if (name === "CategorySelector") {
                    return CategorySelector;
                }
                if (name === "SectionSelector") {
                    return SectionSelector
                }
                return null;
            }
        },
        created() {
            // $.on("projectSelect", (name) => {
            //
            // });
        }
    };
</script>