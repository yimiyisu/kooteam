<template>
    <div class="k-board-add">
        <div class="action" @click="show" v-show="!isAdd">
            <i class="ft icon">&#xe857;</i>添加待办
        </div>
        <div class="wrap" v-show="isAdd">
            <z-input type="textarea" v-model="title" autosize placeholder="请输入要处理的事项" @keyup.native="keyup"/>
            <!--            <z-tcode code="priority" type="radio" label="优先级"></z-tcode>-->
            <div class="prority">
                <z-tooltip v-for="item in prorityData" :content="item.title" :key="item.key">
                    <label @click="select(item,$event)"
                           :class="['k-prority-add',item.key,{active:item.key===prority}]"></label>
                </z-tooltip>
                <div class="btns">
                    <z-button size="mini" type="primary" @click="save">添加任务</z-button>
                    <!--                    <i class="ft icon" @click="save">&#xe798;</i>-->
                    <i class="ft icon" @click="close">&#xe710;</i>
                </div>
            </div>
        </div>
    </div>
</template>
<script>

    import prorityData from "../../common/prority"

    export default {
        props: ["data"],
        data: function () {
            return {
                title: "",
                uid: "",
                prority: "b",
                isAdd: false,
                prorityData: prorityData
            }
        },
        mounted: function () {
            this.uid = zen.user.id;
        },
        methods: {
            show() {
                this.isAdd = true;
                this.$nextTick(_ => {
                    let el = $("textarea", this.$el).el;
                    el[0].focus();
                });
            },
            close() {
                this.isAdd = false;
            },
            select: function (val, evt) {
                if (val.key === this.prority) {
                    return;
                }
                this.prority = val.key;
            },
            keyup(event) {
                let code = event.keyCode;
                if (code === 13) {
                    event.stopPropagation();
                    event.preventDefault();
                    this.save();
                    this.$nextTick(_ => {
                        this.title = "";
                    })
                }
                if (code === 27) {
                    event.preventDefault();
                    return this.close();
                }
            },
            save: function () {
                if (!this.title) {
                    return alert("任务内容不能为空");
                }
                let param = {
                    title: this.title,
                    tag: this.data.tag,
                    projectId: $.getParam('id'),
                    quadrant: "b",
                    status: 0,
                };
                if (this.prority) {
                    param.quadrant = this.prority;
                }
                $.post(param, "/thing/put.do", function (reback) {
                    let data = reback.data;
                    param._id = data._id;
                    param.order = data.order;
                    param.owner = data.owner;
                    this.title = "";
                    this.$emit('changeCategory', param);
                    // this.close();
                }, this);
            }
        }
    }
</script>