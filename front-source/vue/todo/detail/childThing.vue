<template>
    <z-row class="z-row k-dialog-list">
        <z-col :span="1"><span class="ft icon h2">&#xe819;</span></z-col>
        <z-col :span="23">
            <h4 class="title">{{item.title}}</h4>
            <span class="right">
                <z-dropdown split-button @command="handleClick">操作
                    <var command="1">隐藏完成的项目</var>
                    <var command="2">删除</var>
                    <!--                    <z-button plain @click="hide">隐藏完成的项目</z-button>-->
                    <!--                    <z-confirm plain type="danger" size="mini" plain tip="删除清单是永久性操作，无法撤销。"-->
                    <!--                               @click="remove">删除</z-confirm>-->
                </z-dropdown>
            </span>
            <z-progress :percentage="percent">
            </z-progress>
            <ul class="detailed-list">
                <li class="k-thing" v-for="(itemChild, childInx) in item.childList"
                    :class="{finish: itemChild.status === 1}" v-show="show(itemChild.status)">
                    <label @click.stop="doFinish(childInx, itemChild._id)">
                        <i class="z-icon"></i>
                    </label>
                    <div class="title" v-if="itemChild.status === 1">{{itemChild.title}}</div>
                    <input class="title" v-else @keyup.enter="updateTitle(childInx)"
                           v-model="itemChild.title">
                    <z-popover>
                        <span slot="reference" class="opertion">操作</span>
                        <ul class="thing-child">
                            <li style="line-height: 25px;font-size: 12px;" @click="replace(childInx,itemChild._id)">
                                转为任务
                            </li>

                            <li style="line-height: 25px;font-size: 12px;">
                                <z-confirm type="text" plain tip="确定删除吗"
                                           @click="childRemove(childInx, itemChild._id)">删除
                                </z-confirm>
                            </li>
                        </ul>
                    </z-popover>
                </li>
            </ul>
            <z-input
                    class="add-content"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-show="isAdd"
                    @keyup.enter.native="submit(item._id)"
                    v-model="content">
            </z-input>
            <z-button v-if="!isAdd" class="add-list" @click="add">添加项目</z-button>
            <z-button v-else @click="submit(item._id)" class="add-list" type="primary">添加</z-button>
            <span v-show="isAdd" @click="close" class="ft icon close-content">&#xe710;</span>
        </z-col>
    </z-row>
</template>
<script>
    export default {
        name: "childThing",
        data() {
            return {
                content: "",
                isAdd: false,
                percent: 0,
                childList: [],
                isHide: false
            }
        },
        props: ['item', 'index', 'value'],
        inject: ["addLog"],
        mounted() {
            this.childList = this.item.childList;
            this.getPercent()
        },
        methods: {
            handleClick(val) {
                if (val == "1") {
                    this.hide();
                } else if (val == "2") {
                    this.remove();
                }
            },
            show(status) {
                if (this.isHide && status === 1) {
                    return false
                }
                return true;
            },
            hide() {
                this.isHide = !this.isHide;
            },
            getPercent() {
                let total = 0;
                for (let i = 0; i < this.childList.length; i++) {
                    let item = this.childList[i];
                    if (item.status === 1) {
                        total++;
                    }
                }
                if (total === 0) {
                    return this.percent = 0;
                }
                this.percent = total / this.childList.length * 100;
            },
            getList() {
                $.post({parentId: this.value._id}, "/mix/thingList.json", (reback) => {
                    this.list = reback.data;
                });
            },
            updateTitle(inx) {
                $.post({
                    _id: this.childList[inx]._id,
                    title: this.childList[inx].title
                }, '/patch/childThing.json', (reback) => {
                });
            },
            remove(event) {
                $.confirm("删除清单是永久性操作，无法撤销。", () => {
                    $.post({id: this.item._id}, '/thing/removeThing.do', (reback) => {
                        this.$emit('removeThing', this.index);
                        this.addLog("移除了任务上的清单 " + this.item.title);
                    });
                });

            },
            add() {
                this.isAdd = true;
            },
            replace(childInx, id) {
                $.post({_id: id}, '/delete/childThing.json', (reback) => {
                    $.post({
                        title: this.childList[childInx].title,
                        projectId: this.value.projectId,
                        quadrant: this.value.quadrant
                    }, '/put/thing.json', (data) => {
                    })
                });
            },
            childRemove(childInx, id) {
                $.post({_id: id}, '/delete/childThing.json', (reback) => {
                    this.childList.splice(childInx, 1);
                    this.getPercent();
                })
            },
            doFinish(childIndex, id) {
                let status = this.item.childList[childIndex].status === 0;
                this.childList[childIndex].status = status ? 1 : 0;
                $.post({
                    _id: id,
                    status: this.childList[childIndex].status
                }, '/patch/childThing.json', (reback) => {
                    this.addLog("完成了任务上的 " + this.childList[childIndex].title);
                    this.getPercent();
                });
            },
            add() {
                this.isAdd = true;
            },
            submit(parentId) {
                let content = this.content;
                $.post({
                    title: content,
                    parentId: parentId,
                    status: 0
                }, "/put/childThing.json", (reback) => {
                    this.childList.push(reback.data);
                    this.isAdd = true;
                    this.content = '';
                    this.getPercent();
                })
            },
            close() {
                this.isAdd = false;
            }
        }
    }
</script>