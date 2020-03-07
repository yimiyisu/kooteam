<template>
    <z-popover v-model="visible" trigger="click" width="150" placement="top">
        <ul class="k-quard-list">
            <li v-for="(item,idx) in priority" :style="{'color': item.color}" :key="idx"
                @click="quard(item.type, item.title)">
                <i v-show="item.type === thing.quadrant" class="ft icon">&#xe6d9;</i>
                <i v-show="item.type !== thing.quadrant" class="ft icon">&#xe770;</i>
                {{item.title}}
            </li>
        </ul>
        <template slot="reference">
            <div class="btn"><i class="ft icon">&#xe7ad;</i>优先级</div>
        </template>
    </z-popover>
</template>
<script>
    export default {
        data() {
            return {
                thing: null,
                visible: false,
                priority: [
                    {
                        title: "重要且紧急",
                        type: 'a',
                        color: "#f80e15"
                    },
                    {
                        title: "重要不紧急",
                        type: 'b',
                        color: "#BF9F03"
                    },
                    {
                        title: "紧急不重要",
                        type: 'c',
                        color: "#009fe3"
                    },
                    {
                        title: "不紧急不要",
                        type: 'd',
                        color: "#79aa1c"
                    }
                ]
            }
        },
        inject: ["getThing", "log"],
        created() {
            this.thing = this.getThing();
        },
        methods: {
            quard(val, title) {
                this.thing.quadrant = val;
                $.post({_id: this.thing._id, quadrant: val,}, '/thing/patch.do', (reback) => {
                    this.log("设置了优先级 " + title);
                });
            }
        }
    }
</script>