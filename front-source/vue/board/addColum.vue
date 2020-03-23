<template>
    <div class="column">
        <div class="k-board-add">
            <div class="action" @click="show" v-show="!isAdd">
                <i class="ft icon">&#xe857;</i>添加一个新列表
            </div>
            <div class="wrap" v-show="isAdd">
                <z-input type="textarea" v-model="title" autosize placeholder="请输入要处理的事项" @keyup.native="keyup"/>
                <div class="prority">
                    <div class="btns">
                        <z-button size="mini" type="primary" @click="save">添加任务</z-button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                isAdd: false
            }
        },
        methods: {
            save() {

            }
        }
    }
</script>