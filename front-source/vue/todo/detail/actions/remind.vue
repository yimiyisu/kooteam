<template>
    <z-popover>
        <div class="btn" slot="reference">
            <i slot="reference" class="ft icon">&#xe6b1;</i>提醒设置
        </div>
        <ul class="k-quard-list">
            <li v-for="item in remind" @click="click(item.value)" :class="{'active': thing.remind === item.value}">
                <i v-show="item.value == thing.remind" class="ft icon">&#xe6d9;</i>
                <i v-show="item.value != thing.remind" class="ft icon">&#xe770;</i>
                {{item.title}}
            </li>
        </ul>
    </z-popover>
</template>
<script>
    export default {
        data() {
            return {
                thing: null,
                remind: [
                    {
                        title: "开始时5分钟",
                        value: 0
                    },
                    {
                        title: "开始时前15分钟",
                        value: 1
                    },
                    {
                        title: "开始时前30分钟",
                        value: 2
                    },
                    {
                        title: "开始时前1天",
                        value: 3
                    }
                ]
            }
        },
        inject: ["getThing"],
        created() {
            this.thing = this.getThing();
        },
        methods: {
            click(val) {
                this.thing.remind = val;
                $.post({
                    _id: this.thing._id,
                    remind: val
                }, '/thing/patch.do', (reback) => {
                });
            }
        }
    }
</script>