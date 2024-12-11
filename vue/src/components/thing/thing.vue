<template>
    <div :class="['k-thing', { finish: data.status === 6 }]" @dblclick="dblclick" @click="detail" :data-target="data.id"
        style="display:flex;flex:1">
        <label @click.stop="doFinish">
            <z-icon value="checkSquare" v-if="data.status === 6" />
            <z-icon value="square" v-else />
        </label>
        <el-text truncated>
            <z-icon value="alertCircle" v-if="overtime" />
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
    2: { color: '#BF9F03', label: 'P2' }
}
export default {
    inject: ['$dict'],
    props: {
        data: Object,
        quadrantable: {
            type: Boolean,
            default: false
        },
        now: Number
    },
    data() {
        return {
            timer: null,
        }
    },
    created() {
        $.on("thingUpdate", this.watchStatus);
    },
    computed: {
        quadrant() {
            const { quadrantable } = this
            if (!quadrantable) {
                return null
            }
            return quadrantOptions[this.data.quadrant]
        },
        current() {
            if (!this.now) {
                let now = new Date();
                return parseInt(now.getTime() / 1000);
            }
            return this.now;
        },
        overtime() {
            let item = this.data;
            return item.status === 0 && item.end && item.end < this.current;
        },
    },
    methods: {
        watchStatus(thing) {
            const { id, title, status, quadrant } = thing
            if (this.data.id !== id) {
                return;
            }
            if (quadrant !== this.data.quadrant) {
                console.log('修改了优先级')
            }
            title && (this.data.title = title)
            this.data.status = status
        },
        async doFinish() {
            let thing = this.data,
                id = thing.id,
                status = thing.status === 0 ? 6 : 0;
            let param = { id, status };
            await $.post({ data: param, url: "/do/patch/thing" });
            thing["status"] = status;
            let parent = this.$parent;
            if (parent.sort) {
                parent.sort(id, status);
            }
            let content = status ? "完成了任务" : "取消了完成";
            $.post({
                data: { thingId: id, content },
                url: "/do/put/thing_log",
            });
        },
        detail() {
            $.emit("thingDetail", this.data);
        },
        dblclick(evt) {
            evt.preventDefault();
            evt.stopPropagation();
        },
    },
};
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