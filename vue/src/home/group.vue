<template>
    <el-row class="blocks" ref="link">
        <el-col :span="6">
            <div class="wrap-lefts">
                <z-icon value="layers" class="icons" />待办四象限:
                突出事情优先级，帮助员工合理安排时间，提高工作效率。
            </div>
        </el-col>
        <el-col :span="18">
            <el-image src="https://a.ebus.vip/kooteam/banner/todo.jpg" />
        </el-col>
    </el-row>
    <el-row class="blocks">
        <el-col :span="18">
            <el-image src="https://a.ebus.vip/kooteam/banner/project.jpg" />
        </el-col>
        <el-col :span="6">
            <div class="wrap-rights">
                <z-icon value="package" class="icons" />项目管理:
                自定义项目看板，可视化任务安排。
            </div>
        </el-col>
    </el-row>
    <el-row class="blocks">
        <el-col :span="6">
            <div class="wrap-lefts">
                <z-icon value="trello" class="icons" />在线知识库:
                在线流程图，在线文档，以及可视化的目录编排，文档管理无忧。
            </div>
        </el-col>
        <el-col :span="18">
            <el-image src="https://a.ebus.vip/kooteam/banner/wiki.jpg" />
        </el-col>
    </el-row>
    <el-row class="blocks">
        <el-col :span="18">
            <el-image src="https://a.ebus.vip/kooteam/banner/week.jpg" />
        </el-col>
        <el-col :span="6">
            <div class="wrap-rights">
                <z-icon value="calendar" class="icons" />日程管理:
                可视化日程管理，快速搞定工作计划，了解工作宏观安排。
            </div>
        </el-col>
    </el-row>
</template>
<script>
export default {};
</script>
<style scoped>
.blocks {
    max-width: 1200px;
    margin: 30px auto;
    padding-top: 50px;
}

.a-col-6 {
    width: 300px;
}

.wrap-lefts {
    margin: 20px 30px 0 0;
    line-height: 36px;
    color: #666;
    font-size: 16px;
}

.icons {
    color: rgba(248, 14, 21, 0.7);
    margin-right: 6px;
    font-style: normal;
}

.a-col-18 {
    width: 75%;
    display: inline-block;
    zoom: 1;
    box-sizing: border-box;
    vertical-align: top;
    text-rendering: auto;
}

.wrap-rights {
    margin: 20px 0 0 30px;
    line-height: 36px;
    color: #666;
    font-size: 16px;
}

.blocks .a-image__inner {
    border: 5px solid #fff;
    border-radius: 10px;
}

.a-image {
    overflow: visible;
    height: -webkit-fill-available;
    width: -webkit-fill-available;
}
</style>
