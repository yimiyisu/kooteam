<template>
    <div class="header z-row">
        <div class="z-col">
            <i class="ft icon flag">&#xe753;</i>{{name}}
        </div>
        <div class="z-1" :class="{'active':active}">
            <label @click="show(1)">
                <z-input type="text" maxlength="200" width="100%" @keyup.native="keyup"
                         v-model="text" placeholder="请在这里输入需要处理的事项"></z-input>
            </label>
            <i class="ft icon close" @click="show(0)"></i>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["quadrant", "name", "todoList"],
        data: function () {
            return {
                text: "",
                isBlur: true,
                active: false
            }
        },
        methods: {
            hide: function () {
                this.active = false;
            },
            show: function (type) {
                if (type === 0) {
                    this.active = !this.active;
                } else {
                    this.active = true;
                }
                if (this.active) {
                    this.$nextTick(function () {
                        this.$el.querySelector('input').focus();
                    });
                }
            },
            keyup: function (e) {
                e.stopPropagation();
                e.preventDefault();
                let code = e.keyCode;
                if (code === 27) {
                    return this.hide();
                }
                if (code !== 13) {
                    return;
                }
                let data = {};
                let title = this.text;
                if (!title) {
                    return;
                }
                data["title"] = title;
                data["quadrant"] = this.quadrant;
                $.post(data, "/thing/put.do", function (reback) {
                    let data = reback.data;
                    data.status = parseInt(reback.data);
                    this.$emit("finish", data);
                    this.text = "";
                }, this);
            }
        }
    }
</script>