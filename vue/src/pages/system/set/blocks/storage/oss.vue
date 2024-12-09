<template>
    <z-form-items :fields="fields" />
</template>
<script>
export default {
    data() {
        return {
            fields: [
                { label: "AccessKey ID", name: "bucketAK" },
                { label: "AccessKey Secret", name: "bucketSK", tip: "加密存储，不回显不需要重复输入" },
                {
                    label: "EndPoint", name: "bucketEndpoint", placeholder: "举例：https://oss-cn-hangzhou.aliyuncs.com"
                },
                { label: "公有Bucket名", name: "bucketPublic" },
                { label: "私有Bucket名", name: "bucketPrivate" }
            ]
        }
    }
}
</script>