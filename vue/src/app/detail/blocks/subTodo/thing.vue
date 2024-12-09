<template>
    <div :class="['k-thing', { finish: value.status === 6 }]">
        <label @click.stop="doFinish">
            <z-icon value="checkSquare" v-if="value.status === 6" />
            <z-icon value="square" v-else />
        </label>
        <div class="content">
            <z-icon value="alertCircle" v-if="overtime" />
            {{ value.title }}
        </div>
        <div class="action">
            <z-action mode="popover" url="/do/patch/thing" :data="value" :fields="fields" width="420px" type="text"
                icon="edit3" />
            <z-action type="text" url="/do/delete/thing" :data="value" icon="trash" @finish="remove" />
            <z-avatar :tip="false" :value="value.owner" />
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: Object,
        fields: Array
    },
    inject: ["log"],
    data() {
        return {}
    },
    methods: {
        async remove() {
            const { value } = this
            this.log("移除了子任务:" + value.title)
            $.emit('thingUpdate', this.thing, 'remove')
        },
        async doFinish() {
            const { value } = this;
            let status = value.status === 0 ? 6 : 0;
            await $.post({
                data: {
                    id: value.id,
                    status: status,
                },
                url: "/do/patch/thing",
            });
            let msg = status === 0 ? "取消完成" : "完成了";
            this.log(msg + "子任务:" + value.title);
            $.emit('thingUpdate', this.thing)
        },
    },
};
</script>
<style lang="scss" scoped>
.k-thing {
    position: relative;
    margin-bottom: 12px;

    &:hover :deep(.a-tooltip__trigger) {
        display: inline-block;
    }
}

.action {
    position: absolute;
    top: 38px;
    right: 0;

}

:deep(.a-tooltip__trigger) {
    display: none;
}

.content {
    display: inline-block;
}

.action {
    position: absolute;
    text-align: right;
    top: 4px;
    right: 0;

    :deep(.a-icon) {
        padding-right: 10px;
    }
}
</style>
