<template>
    <div>
        <z-block url="/api/home/makeWxLink" :params="params">
        <template #default="data">
            {{data}}
            <z-copy label="复制链接" :value="data" style="width:100%;margin-bottom:6px;text-align: center; width: 100%" />
        </template>
        </z-block>
    </div>
</template>
<script>
export default {
    props: {
        data: Object
    },
    data() {
        return {
            params:this.data
        }
    },
    methods: {
        refresh() {
            this.params = {...this.data, temp: 0};
        }
    },
}
</script>