<template>
    <div>
        <keep-alive>
            <component :is="com" v-model="value"></component>
        </keep-alive>
        <z-popover v-if="current==='gantt'" trigger="hover" width="60">
            <ul class="k-quard-list">
                <li @click="emit('now')">
                    <span class="ft icon" :class="{'active':active==='now'}">现在</span>
                </li>
                <li @click="emit('day')">
                    <span class="ft icon" :class="{'active':active==='day'}">天视图</span>
                </li>
                <li @click="emit('week')">
                    <span class="ft icon" :class="{'active':active==='week'}">周视图</span>
                </li>
                <li @click="emit('month')">
                    <span class="ft icon" :class="{'active':active==='month'}">月视图</span>
                </li>
            </ul>
            <template slot="reference">
                <i class="k-gantt-action ft icon" @click="emit('now')">&#xe8a1;</i>
            </template>
        </z-popover>
    </div>
</template>
<script>
    import Board from "./board/index"
    import List from "./list/index"
    import Gantt from "./gantt/index"

    export default {
        props: ["name", "value"],
        data() {
            return {
                current: null,
                active: 'day'
            }
        },
        computed: {
            com() {
                let name = this.current;
                if (name === "board") {
                    return Board;
                }
                if (name === "list") {
                    return List;
                }
                if (name === "gantt") {
                    return Gantt;
                }
                return null;
            }
        },
        created() {
            this.current = this.name;
            $.on("projectView", (name) => {
                this.current = name;
            });
        },
        methods: {
            emit(val) {
                this.active = val;
                $.emit('ganttConfig', 'period', val);
            }
        }
    };
</script>