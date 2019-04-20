<template>
    <div class="wrap">
        <div v-for="i in imgs" class="skin" :class="{'active':i===def}" @click="select(i)">
            <img :src="'//a.yimiyisu.com/kooteam/bg/'+i+'.jpg'"/>
        </div>
        <input type="hidden" name="skin" :value="def">
    </div>
</template>
<script>
    export default {
        props: ["value", "data"],
        data: function () {
            return {
                imgs: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
                def: 3
            }
        },
        mounted: function () {
            if (this.value) {
                this.def = this.value;
            }
        },
        methods: {
            select: function (i) {
                this.def = i;
                let bgImg = '//a.yimiyisu.com/kooteam/bg/' + i + '.jpg';
                $("body").css("background-image", "url('" + bgImg + "')");
            }
        }
    }
</script>