<template>
    <span>{{title}}</span>
</template>
<script>
    export default {
        props: ["sections", "value"],
        computed: {
            title() {
                let sections = this.sections;
                if (!sections) {
                    return "";
                }
                for (let i = 0; i < sections.length; i++) {
                    if (sections[i].value === this.value) {
                        return sections[i].text;
                    }
                }
                return "";
            }
        }
    }
</script>