<template>
    <div class="todo-editor">
        <input type="text" class="input" autofocus maxlength="90" @keydown.esc.stop="hide" @keyup.enter="submit"
               v-model="item.title"
               placeholder="按回车键，添加子任务"/>
        <div>
            <z-button type="success" @click="submit" size="mini">保存</z-button>
            <z-button type="info" @click="hide" size="mini">取消</z-button>
            <z-popover v-model="visible">
                <z-employee :value="owner" :max="1"></z-employee>
                <div class="operator">
                    <z-button plain size="mini" @click="close">取消</z-button>
                    <z-button size="mini" type="primary" @click="setOwner">确定</z-button>
                </div>
                <template #reference>
                    <!--<i class="ft icon hover" @click="visible=true">&#xe6ab;</i>-->
                </template>
            </z-popover>
        </div>
    </div>
</template>
<script>
    export default {
        props: ["value", "todo", "list"],
        data() {
            return {
                owner: null,
                item: {
                    title: ""
                },
                visible: false
            }
        },
        inject: ["getThing"],
        mounted() {
            this.todo && (this.item = this.todo);
            this.$nextTick(function () {
                $(".input", this.$el).el[0].focus();
            });
        },
        methods: {
            submit() {
                if (!this.item.title) {
                    return;
                }
                let params = {
                    title: this.item.title
                };
                if (this.item._id) {
                    params._id = this.item._id;
                    $.post(params, "/patch/childThing.json", (reback) => {
                        this.todo.title = params.title;
                        this.hide();
                    }, this)
                } else {
                    let thing = this.getThing();
                    params.parentId = thing._id;
                    params.status = 0;
                    $.post(params, "/put/childThing.json", (reback) => {
                        params._id = reback.data._id;
                        this.list.push(params);
                        this.item.title = "";
                    }, this)
                }
            },
            setOwner() {

            },
            hide() {
                this.$emit("input", false);
            },
            close() {
                this.visible = false;
            }
        }
    }
</script>