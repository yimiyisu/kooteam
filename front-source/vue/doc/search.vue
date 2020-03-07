<template>
    <div>
        <i @click="click" class="ft icon search-icon hover">&#xe7ae;</i>
        <div class="search-dialog" v-show="show"></div>
    </div>
</template>
<script>
    export default {
        data: function () {
            return {
                show: false
            }
        },
        methods: {
            click: function () {
                this.show = !this.show;
            }
        }
    }
</script>