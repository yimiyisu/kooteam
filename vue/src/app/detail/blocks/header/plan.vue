<template>
    <el-row>
        <el-col :span="1"><z-icon value="clock" /></el-col>
        <el-col :span="19" class="date">
            计划：
            <el-date-picker v-model="daterange" value-format="x" size="small" :editable="false" type="datetimerange"
                end-placeholder="未设置" :defaultTime="defaultTime" @calendar-change="calChange" :shortcuts="shortcuts"
                @change="change">
            </el-date-picker>
            <span v-if="overtime" class="delay">(已延期{{ overtime }}) </span>
        </el-col>
        <el-col :span="4">
            <!-- <z-dict code="thingRepeat" v-model="repeat" /> -->
        </el-col>
    </el-row>
</template>
<script>
const defTime = new Date()
export default {
    name: "detailPlan",
    inject: ['log'],
    props: { value: Object, readonly: Boolean },
    computed: {
        start() {
            return this.value.start || $.dayjs().unix()
        },
        overtime() {
            const { end } = this.value;
            if (!end) {
                return null
            }
            const now = $.dayjs(defTime).unix()
            const span = now - end
            if (span < 0) {
                return null
            }
            const hour = parseInt(span / 3600)
            if (hour < 24) {
                return hour + "小时"
            }
            return parseInt(hour / 24) + "天";
        }
    },
    data() {
        return {
            daterange: [],
            defaultTime: [defTime, defTime],
            shortcuts: [{
                text: '两小时',
                value: () => {
                    const start = this.start * 1000
                    return [start, start + 2 * 3600 * 1000]
                },
            },
            {
                text: '四小时',
                value: () => {
                    const start = this.start * 1000
                    return [start, start + 4 * 3600 * 1000]
                },
            },
            {
                text: '六小时',
                value: () => {
                    const start = this.start * 1000
                    return [start, start + 6 * 3600 * 1000]
                },
            }, {
                text: '一天',
                value: () => {
                    const start = this.start * 1000
                    return [start, start + 24 * 3600 * 1000]
                },
            }, {
                text: '两天',
                value: () => {
                    const start = this.start * 1000
                    return [start, start + 48 * 3600 * 1000]
                },
            }, {
                text: '三天',
                value: () => {
                    const start = this.start * 1000
                    return [start, start + 72 * 3600 * 1000]
                },
            }
            ],
            repeat: 0,
        };
    },
    created() {
        const { value } = this;
        this.daterange[0] = this.start * 1000
        if (value.end) {
            this.daterange[1] = value.end * 1000
        }
    },
    methods: {
        calChange(data) {
            if (!data || this.readonly) {
                return
            }
            // 修复默认时间为早上九点
            this.value.start = $.dayjs(data[0]).unix() + 9 * 3600
            if (data[1]) {
                let end = $.dayjs(data[1]).unix()
                if (end <= this.value.start) {
                    end = this.value.start + 2 * 3600
                    data[1] = $.dayjs(end * 1000)
                    this.value.end = end
                }
            }
        },
        async change(data) {
            if (data === null) {
                this.daterange = [$.dayjs().unix() * 1000]
                this.value.start = 0
                this.value.end = 0
            } else {
                this.value.start = data[0] / 1000
                this.value.end = data[1] / 1000
            }
            await $.post({ url: '/do/patch/thing', data: this.value })
        }
    },
};
</script>
<style lang="scss" scoped>
:deep(.a-input__wrapper) {
    border: 0;
    box-shadow: none;
    width: 320px;
    margin: -6px 0 0 -8px;
    display: inline-block;

    .a-range-input {
        text-align: left;
    }

    .a-range-separator {
        margin-right: 14px;
    }

    .a-range__icon {
        display: none;
    }
}

.delay {
    color: var(--a-color-error-dark-2)
}
</style>