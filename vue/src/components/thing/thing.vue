<template>
    <div class="k-thing" @dblclick="dblclick" @click="detail" :data-target="data.id" style="display: flex; flex: 1">
        <label @click.stop="doFinish">
            <z-icon value="checkSquare" v-if="data.status === 6" />
            <z-icon value="square" v-else />
        </label>
        <el-text truncated :tag="tag">
            <z-icon type="warning" tooltip="已延期" value="alertCircle" v-if="overtime" />
            <span :style="'--qcolor:' + quadrant.color" class="quadrant" v-if="quadrant">
                {{ quadrant.label }}
            </span>
            {{ data.title }}
        </el-text>
    </div>
</template>
<script>
const quadrantOptions = {
    1: { color: '#F80E15', label: 'P1' },
    2: { color: '#BF9F03', label: 'P2' },
}
export default {
    inheritAttrs: false,
    inject: { '$dict': { default: null }, '$table': { default: null } },
    props: {
        data: Object,
        quadrantable: {
            type: Boolean,
            default: false,
        },
        archived: Boolean,
        now: Number,
    },
    data() {
        return {
            timer: null,
        }
    },
    computed: {
        tag() {
            return this.data.status === 6 ? 'del' : undefined
        },
        quadrant() {
            const { quadrantable } = this
            if (!quadrantable) {
                return null
            }
            return quadrantOptions[this.data.quadrant]
        },
        current() {
            if (!this.now) {
                let now = new Date()
                return parseInt(now.getTime() / 1000)
            }
            return this.now
        },
        overtime() {
            let item = this.data
            return item.status === 0 && item.end && item.end < this.current
        },
    },
    methods: {
        change() {
            const { $table } = this
            if ($table) {
                $table.reload()
            }
        },
        async doFinish() {
            let thing = this.data,
                id = thing.id,
                status = thing.status === 0 ? 6 : 0
            let param = { id, status }
            await $.post({ data: param, url: '/do/patch/thing' })
            thing['status'] = status
            let parent = this.$parent
            if (parent.sort) {
                parent.sort(id, status)
            }
            let content = status ? '完成了任务' : '取消了完成'
            $.post({
                data: { thingId: id, content },
                url: '/do/put/thing_log',
            })
        },
        detail() {
            const { archived, data } = this
            $.once('thingUpdate', this.change)
            $.emit('thingDetail', { archived, id: data.id })
        },
        dblclick(evt) {
            evt.preventDefault()
            evt.stopPropagation()
        },
    },
}
</script>
<style lang="scss">
.quadrant {
    background: var(--qcolor);
    border: 1px solid var(--qcolor);
    font-size: 10px;
    color: var(--a-fill-color);
    border-radius: 6px;
}
</style>
