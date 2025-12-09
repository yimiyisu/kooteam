<template>
    <el-row>
        <el-col :span="1"><z-icon value="clock" /></el-col>
        <el-col :span="19" class="date">
            计划：
            <el-date-picker v-model="daterange" value-format="x" size="small" :editable="false" type="datetimerange"
                end-placeholder="未设置" :disabled="true">
            </el-date-picker>
            <span v-if="overtime" class="delay">(已延期{{ overtime }}) </span>
        </el-col>
        <el-col :span="4">
        </el-col>
    </el-row>
</template>
<script>
const defTime = new Date()
export default {
    name: "viewDetailPlan",
    props: { value: Object },
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
        };
    },
    created() {
        const { value } = this;
        this.daterange[0] = this.start * 1000
        if (value.end) {
            this.daterange[1] = value.end * 1000
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

