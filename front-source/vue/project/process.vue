<template>
    <div class="k-project-process">
        <ul>
            <li v-for="item in process"><span class="item-name">{{item.title}}</span></li>
        </ul>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                process: []
            }
        },
        props: ['content'],
        created() {
            this.process = JSON.parse(this.content);
        }
    }
</script>