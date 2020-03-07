<template>
    <z-list :url="'/select/thingLog.json?thingId='+thingId" :size="10">
        <template #default="scope">
            <div class="log">
                <z-nick class="nick" :uid="scope.uid"></z-nick>
                {{scope.content}}
                <div class="time">{{scope.addtime|date}}</div>
            </div>
        </template>
    </z-list>
</template>
<script>
    export default {
        inject: ["getThing"],
        data() {
            return {
                thingId: null,
            }
        },
        created() {
            let thing = this.getThing();
            this.thingId = thing._id;
        }
    }
</script>