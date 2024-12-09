<template>
    <z-form-items :fields="fields" />
</template>
<script>
export default {
    data() {
        return {
            fields: [
                { label: "SecretId", name: "bucketAK" },
                { label: "SecretKey", name: "bucketSK", tip: "加密存储，不回显不需要重复输入" },
                { label: "所属地域", name: "bucketRegion", placeholder: "举例：ap-shanghai" },
                { label: "公有存储桶名", name: "bucketPublic" },
                { label: "私有存储桶名", name: "bucketPrivate" }
            ]
        }
    }
}
</script>