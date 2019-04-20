<template>
    <div class="header z-row">
        <div class="z-col">
            <i class="z-icon flag">&#xe153;</i>{{name}}
        </div>
        <div class="z-1" :class="{'active':active}">
            <label @click="show(1)">
                <z-input type="text" maxlength="200" width="100%" @blur="hide" @keyup.native="keyup"
                         v-model="text" placeholder="请在这里输入需要处理的事项"></z-input>
            </label>
            <i class="z-icon close" @click="show(0)"></i>
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
            stop: function (e) {
                e.stopPropagation();
            },
            hide: function () {
                this.active = false;
                this.isBlur = true;
                this.$nextTick(function () {
                    this.isBlur = false;
                });
            },
            show: function (type) {
                // if (this.active || this.isBlur) {
                //     return this.isBlur = false;
                // }
                if (type === 0) {
                    this.active = !this.active;
                } else {
                    this.active = true;
                }
                if (this.active) {
                    this.$nextTick(function () {
                        this.$el.querySelector('input').focus();
                        //$("input", this.$el).focus();
                    });
                }
            },
            keyup: function (e) {
                e.stopPropagation();
                e.preventDefault();
                let code = e.keyCode;
                if (code === 13) {
                    let data = {};
                    let title = this.text;
                    if (!title) {
                        return;
                    }
                    data["title"] = title;
                    data["quadrant"] = this.quadrant;
                    $.http(data, "/thing/put.do", function (reback) {
                        let resultData = reback.data;
                        data._id = resultData._id;
                        let tempStatus = resultData.status;
                        data.status = parseInt(tempStatus);
                        this.$parent.data.sons.unshift(data);
                        this.text = "";
                    }, this);
                }
            }
        }
    }
</script>