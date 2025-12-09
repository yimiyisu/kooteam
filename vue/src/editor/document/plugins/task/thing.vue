<template>
    <div :class="['k-thing', { finish: value.status === 6 }]">
        <label @click.stop="doFinish">
            <z-icon value="checkSquare" v-if="value.status === 6" />
            <z-icon value="square" v-else />
        </label>
        <div class="content">
            <z-icon value="alertCircle" v-if="overtime" tooltip="已延期"/>
            {{ value.title }}
            <z-avatar size="20px" :tip="false" :value="value.owner" />
        </div>
        <div class="action">
            <!-- 查看详情 -->
            <z-action type="text" icon="eye" @click="viewDetail" />
            <!-- 编辑 -->
            <z-action mode="popover" url="/do/patch/thing" :data="value" width="420px" type="text"
                icon="edit3" @click="edit"/>
            <!-- 删除 -->
            <!-- <z-action type="text" url="/do/delete/thing" :data="value" icon="trash" @finish="remove" /> -->
        </div>
    </div>
</template>
<script>
export default {
    props: {
        value: Object,
    },
    inject: ["log"],
    data() {
        return {}
    },
    created() {
        console.log('value', this.value)
    },
    methods: {
        viewDetail() {
            $.emit('viewThingDetail', { archived: false, id: this.value.id })
        },
        edit() {
            $.emit('thingDetail', { archived: false, id: this.value.id })
        },
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
            value.status = status
            this.log(msg + "子任务:" + value.title, 2);
            $.emit('thingUpdate', value)
        },
    },
};
</script>
<style lang="scss" scoped>
.k-thing {
    position: relative;
    padding: 6px;
    border-radius: 4px;

    &:hover {
        background: var(--a-fill-color);

        :deep(.action .a-icon) {

            display: inline-block;
        }
    }
}

.content {
    display: inline-block;
}

.action {
    position: absolute;
    text-align: right;
    top: 4px;
    right: 6px;

    :deep(.a-icon) {
        display: none;
        padding-right: 10px;
    }
}
</style>
