<template>
    <z-row class="k-form-action">
        <i class="ft hover icon more" @click="trigger" :class="{'active':isMore}"></i>
        <z-col :span="6">
            <z-select label="状态" @change="emit" v-model="params.status">
                <var>请选择</var>
                <var value="0">未完成</var>
                <var value="1">已完成</var>
                <var value="2">已超时</var>
            </z-select>
        </z-col>
        <z-col :span="6">
            <z-employee label="负责人" @change="emit" :max="1" v-model="params.owner"></z-employee>
        </z-col>
        <z-col :span="6">
            <z-select @change="emit" v-model="params.priority" label="优先级">
                <var value="a">P1</var>
                <var value="b">P2</var>
                <var value="c">P3</var>
                <var value="d">P4</var>
            </z-select>
        </z-col>
        <z-col :span="6">
            <z-select @change="emit" v-model="params.section" :data="sections" label="阶段"></z-select>
        </z-col>
        <!--        <z-col :span="6" v-show="isMore">-->
        <!--            <z-input @input="changeTitle" v-model="params.title" label="任务关键字"></z-input>-->
        <!--        </z-col>-->
        <z-col :span="12" v-show="isMore">
            <z-date style="width: 200px" label="开始时间" type="datetimerange"
                    range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" :default-time="['9:00:00', '12:00:00']"
                    @confirm="startChange">
            </z-date>
        </z-col>
        <z-col :span="12" v-show="isMore">
            <z-date label="开始时间" type="datetimerange"
                    range-separator="至" start-placeholder="开始日期"
                    end-placeholder="结束日期" :default-time="['9:00:00', '12:00:00']"
                    @confirm="endChange">
            </z-date>
        </z-col>
    </z-row>
</template>
<script>
    export default {
        props: ["sections"],
        data() {
            return {
                params: {
                    status: null,
                    owner: null,
                    priority: null,
                    title: null,
                    section: null,
                    start1: null,
                    start2: null,
                    end1: null,
                    end2: null
                },
                isMore: false,
                startRange: [],
                endRange: [],
                changeTitle: null
            }
        },
        created() {
            this.changeTitle = $.debounce(this.emit, 300);
        },
        methods: {
            trigger() {
                this.isMore = !this.isMore;
            },
            startChange(val) {
                if (!val || val.length === 0) {
                    this.params.start1 = this.params.start2 = null;
                } else {
                    this.params.start1 = val[0];
                    this.params.start2 = val[1];
                }
                $.emit("projectList", this.params)
            },
            endChange(val) {
                if (!val || val.length === 0) {
                    this.params.end1 = this.params.end2 = null;
                } else {
                    this.params.end1 = val[0];
                    this.params.end2 = val[1];
                }
                $.emit("projectList", this.params)
            },
            emit() {
                this.$nextTick(() => $.emit("projectList", this.params));
            }
        }
    }
</script>