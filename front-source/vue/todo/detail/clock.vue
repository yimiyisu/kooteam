<template>
    <div class="clock">
        <span v-if="selected.length===0">待设置</span>
        <span v-for="(item,idx) in selected" :key="item">{{options[item].name}}</span>
        <ul>
            <li v-for="op in options" :class="{'active':op.checked}" @click="select(op.value)">{{op.name}}</li>
        </ul>
    </div>
</template>
<script>
    export default {
        props: ["value"],
        data: function () {
            return {
                selected: [],
                thing: {},
                options: [
                    {name: "开始时前5分钟", value: 0, checked: false},
                    {name: "开始时前15分钟", value: 1, checked: false},
                    {name: "开始时前30分钟", value: 2, checked: false},
                    {name: "开始时前1天", value: 3, checked: false}
                ]
            }
        },
        mounted: function () {
            this.thing = this.value;
            if (!this.thing.remind) {
                return this.selected = [];
            }
            this.selected = this.thing.remind.split(",");
            this.checkStatus();
        },
        methods: {
            select: function (val) {
                console.log(val);
                console.log(this.selected);
                if (this.selected.indexOf(val) === -1) {
                    this.selected.push(val);
                } else {
                    for (let i = 0; i < this.selected.length; i++) {
                        if (this.selected[i] === val) {
                            this.selected.splice(i, 1);
                        }
                    }
                }
                // 去掉了jquery的 inArray 改用了indexOf
                // if ($.inArray(val, this.selected) < 0) {
                //
                // }
                this.emit();
            },
            checkStatus: function () {
                for (let j = 0; j < this.options.length; j++) {
                    this.options[j].checked = false;
                    for (let i = 0; i < this.selected.length; i++) {
                        if (this.options[j].value === this.selected[i]) {
                            this.options[j].checked = true;
                        }
                    }
                }
            },
            emit: function () {
                this.checkStatus();
                this.thing.remind = this.selected.join(",");
                this.$emit("input", this.thing);
            }
        }
    }
</script>