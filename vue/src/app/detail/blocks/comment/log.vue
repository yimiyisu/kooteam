<template>
    <z-table url="/do/select/thing_log" :params="params" :size="6">
        <template #default="{ row }">
            <div class="item">
                <z-user :value="row.uid" />{{ row.content }}
                <div class="title">
                    <z-idate :value="row.updateGmt" />
                </div>
            </div>
        </template>
    </z-table>
</template>
<script>
export default {
    props: { value: Object },
    computed: {
        params() {
            return { thingId: this.value.id }
        }
    },
};
</script>
<style lang="scss" scoped>
.title {
    color: var(--a-text-color-secondary);
    margin-top: 6px;
}

.item {
    border-bottom: 1px solid var(--a-border-color-extra-light);
    margin-bottom: 14px;
    padding-bottom: 4px;
}
</style>