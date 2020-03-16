<template>
    <z-dialog title="添加待办" v-if="isShow">
        <z-input
                type="textarea"
                placeholder="请输入待办内容"
                width="100%"
                size="small"
                v-model="title">
        </z-input>
        <div class="k-cal-add">
            <div class="config-item">
                <div><i class="ft icon">&#xe6af;</i>优先级:</div>
                <div style="margin: 0 10px;">
                    <Priority v-model="item"></Priority>
                </div>
            </div>
        </div>
        <div slot="footer" class="dialog-footer">
            <z-button @click="close">取消</z-button>
            <z-button type="primary" @click="submit">确定</z-button>
        </div>
    </z-dialog>
</template>
<script>
    import Priority from "../todo/detail/priority"

    export default {
        props: ["value", "isCal"],
        data: function () {
            return {
                quadrant: "a",
                title: "",
                isShow: false,
                item: {
                    "quadrant": "a",
                }
            }
        },
        components: {Priority},
        methods: {
            close: function () {
                if (this.isCal) {
                    this.$parent.addThing(null);
                }
                this.isShow = false;
            },
            show: function () {
                this.visible = true;
            },
            blur: function () {
                this.isShow = false;
            },
            submit: function () {
                if (!this.title) {
                    return alert("待办内容不能为空");
                }
                let data = {
                    quadrant: this.item.quadrant,
                    title: this.title,
                    projectId: "",
                    tag: "",
                };
                if (this.isCal) {
                    let start = parseInt(this.value.start.start.getTime() / 1000),
                        end = parseInt(this.value.start.end.getTime() / 1000);
                    data.start = start;
                    let span = end - start;
                    if (span > 24 * 3600 || span < 12 * 3600) {
                        data.end = end;
                    }
                }
                if (this.$parent.projectId) {
                    data.projectId = this.$parent.projectId;
                }
                $.post(data, "/thing/put.do", function (reback) {
                    data._id = reback.data._id;
                    this.$parent.addThing(data);
                    this.close();
                    this.title = "";
                }, this);
            },
            select: function (val) {
                this.quadrant = val;
            }
        }
    }
</script>