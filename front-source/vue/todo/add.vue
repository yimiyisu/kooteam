<template>
    <z-dialog title="添加待办" size="size" :visible.sync="visible">
        <z-input
                type="textarea"
                placeholder="请输入待办内容"
                width="100%"
                size="small"
                v-model="title">
        </z-input>
        <div class="k-cal-add">
            <div class="config-item">
                <div><i class="z-icon">&#xe228;</i>优先级:</div>
                <div style="margin: 0 10px;">
                    <Priority v-model="item"></Priority>
                </div>
            </div>
            <div class="config-item" v-if="!isCal">
                <div><i class="z-icon">&#xe7fc;</i>负责人:</div>
                <div style="margin: 0 10px;">
                    <div class="user-info" @click="show">
                        {{user.nick}}
                    </div>
                    <k-user-search v-if="isShow" @blur="blur" fixed="true" my="true" v-model="user"></k-user-search>
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
        props: ["value", "visible", "isCal"],
        data: function () {
            return {
                quadrant: "a",
                title: "",
                user: {},
                isShow: false,
                item: {
                    "quadrant": "a",
                }
            }
        },
        components: {Priority},
        watch: {
            user: function (val) {
                this.user = val;
                this.isShow = false;
            }
        },
        created: function () {
            let current = zen.user;
            this.user = {
                userId: current.id,
                nick: current.nick
            }
        },
        methods: {
            close: function () {
                if (this.isCal) {
                    this.$parent.addThing(null);
                }
                this.$parent.isShow = false;
            },
            show: function () {
                this.isShow = true;
            },
            blur: function () {
                this.isShow = false;
            },
            submit: function () {
                debugger;
                if (!this.title) {
                    return alert("待办内容不能为空");
                }
                let data = {
                    quadrant: this.item.quadrant,
                    title: this.title,
                    projectId: "",
                    onwer: this.user.userId,
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
                $.http(data, "/thing/put.do", function (reback) {
                    data._id = reback.data._id;
                    this.$parent.addThing(data);
                    this.close();
                    this.title = "";
                }, this);
            }
            ,
            select: function (val) {
                this.quadrant = val;
            }
        }
    }
</script>