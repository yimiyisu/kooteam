<template>
    <div>
        <z-button class="bl mb" @click="trigger">
            添加状态
            <z-dialog v-if="visible" width="480px" title="添加状态">
                <z-input label="状态标题" type="text" maxlength="30" v-model="title"></z-input>
                <z-radio label="是否完成态" v-model.number="type">
                    <var :value="0">否</var>
                    <var :value="1">是</var>
                </z-radio>
                <z-select label="显示颜色" v-model="color">
                    <var value="red">红色</var>
                    <var value="green">绿色</var>
                    <var value="yellow">黄色</var>
                    <var value="gray">灰色</var>
                </z-select>
                <span slot="footer" class="dialog-footer">
                  <z-button @click="trigger">取 消</z-button>
                  <z-button type="primary" @click="set">确 定</z-button>
                </span>
            </z-dialog>
        </z-button>
        <z-table :data="categorys">
            <z-column label="状态名称">
                <template slot-scope="scope">
                    <span :class="['ft',scope.row.color]">{{scope.row.title}}</span>
                </template>
            </z-column>
            <z-column label="是否完成态">
                <template slot-scope="scope">
                    <span>{{scope.row.type===0?"否":"是"}}</span>
                </template>
            </z-column>
            <z-column label="操作">
                <template slot-scope="scope">
                    <span class="z-link" @click="trigger(scope.row)">编辑</span>
                    <z-confirm type="link" tip="确定删除吗" @click="remove(scope.row)">删除</z-confirm>
                </template>
            </z-column>
        </z-table>
    </div>
</template>
<script>
    import Store from "./store"

    export default {
        props: ["value"],
        data() {
            return {
                title: "",
                categorys: [],
                type: 0,
                color: "",
                current: null,
                visible: false,
                boardId: null
            }
        },
        created() {
            let value = this.value;
            this.boardId = value.borderId || zen.id();
            if (value.category) {
                this.categorys = JSON.parse(value.category);
            }
        },
        methods: {
            set() {
                if (!this.title) {
                    return $.notice("标题不能为空", "error");
                }
                if (this.current) {
                    this.categorys.forEach((item) => {
                        if (item.id === this.current) {
                            item.title = this.title;
                            item.type = this.type;
                            item.color = this.color;
                        }
                    });
                } else {
                    this.boardId++;
                    let category = {
                        title: this.title,
                        id: this.boardId,
                        type: this.type,
                        color: this.color
                    };
                    this.categorys.push(category);
                }
                this.save();
            },
            trigger(category) {
                if (category) {
                    this.title = category.title;
                    this.current = category.id;
                    this.type = category.type || 0;
                    this.color = category.color || "";
                } else {
                    this.title = "";
                    this.current = "";
                }
                this.visible = !this.visible;
            },
            remove(category) {
                this.categorys = this.categorys.filter((item) => {
                    if (item.id !== category.id) {
                        return item;
                    }
                });
                this.save();
            },
            save() {
                let projectId = this.value._id;
                $.post({
                    _id: projectId,
                    boardId: this.boardId,
                    category: JSON.stringify(this.categorys)
                }, "/patch/project.json", function (reback) {
                    this.visible = false;
                    Store.set(projectId, this.categorys);
                }, this);
            }
        }
    };
</script>