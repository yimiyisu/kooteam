<template>
    <div class="wrap k-my-setting">
        <div v-for="i in imgs" class="skin" :class="{'active':i===def}" @click="select(i)">
            <img :src="domain+'/bg/'+i+'.jpg'"/>
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
                def: 3,
                domain: ""
            }
        },
        mounted: function () {
            if (zen.mode < 3) {
                this.domain = "//a.yimiyisu.com/kooteam";
            }
            if (this.value) {
                this.def = this.value;
            }
        },
        methods: {
            select: function (i) {
                this.def = i;
                let bgImg = this.domain + '/bg/' + i + '.jpg';
                $("body").css("background-image", "url('" + bgImg + "')");
            }
        }
    }
</script>