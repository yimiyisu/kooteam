<template>
    <dl class="z-left">
        <dt><i class="ft icon h1">&#xe725;</i>优先级：</dt>
        <dd>
            <label class="k-prority a" v-show="thing.quadrant === 'a'">重要且紧急</label>
            <label class="k-prority b" v-show="thing.quadrant === 'b'">重要不紧急</label>
            <label class="k-prority c" v-show="thing.quadrant === 'c'">紧急不重要</label>
            <label class="k-prority d" v-show="thing.quadrant === 'd'">不重要不紧急</label>
        </dd>
    </dl>
</template>
<script>
    export default {
        inject: ["getThing"],
        data: function () {
            return {
                thing: {}
            }
        },
        mounted: function () {
            this.thing = this.getThing();
        }
    }
</script>