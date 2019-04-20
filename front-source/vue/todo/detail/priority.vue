<template>
    <div>
        <label @click="select('a')" class="k-prority a" :class="{'active':thing.quadrant==='a'}"
               v-tip="'重要且紧急'"></label>
        <label @click="select('b')" class="k-prority b" :class="{'active':thing.quadrant==='b'}"
               v-tip="'重要不紧急'"></label>
        <label @click="select('c')" class="k-prority c" :class="{'active':thing.quadrant==='c'}"
               v-tip="'紧急不重要'"></label>
        <label @click="select('d')" class="k-prority d" :class="{'active':thing.quadrant==='d'}"
               v-tip="'不重要不紧急'"></label>
    </div>
</template>
<script>
    export default {
        props: ["value"],
        data: function () {
            return {
                thing: {}
            }
        },
        mounted: function () {
            this.thing = this.value;
        },
        methods: {
            select: function (type) {
                if (type === this.thing.quadrant) {
                    return;
                }
                this.thing.quadrant = type;
                this.$emit("input", this.thing);
            },
        }
    }
</script>