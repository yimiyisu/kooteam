<template>
    <z-scrollbar class="k-main" :height="-100">
        <div class="content">
            <ProjectFilter :sections="sections"/>
            <z-table :data="list" row-key="_id" border>
                <z-column label="任务名称">
                    <template slot-scope="scope">
                        <span class="ft hover" @click="detail(scope.row._id)">{{scope.row.title}}</span>
                    </template>
                </z-column>
                <z-column label="计划时间" width="300">
                    <template slot-scope="scope">
                        <z-idate :value="scope.row.start"/>
                        <span v-if="scope.row.end">至
                        <z-idate :value="scope.row.end"/>
                    </span>
                    </template>
                </z-column>
                <z-column label="负责人" width="120">
                    <template slot-scope="scope">
                        <z-nick :uid="scope.row.owner"/>
                    </template>
                </z-column>
                <z-column label="优先级" width="60">
                    <template slot-scope="scope">
                        <z-tcode code="priority" :value="scope.row.quadrant"/>
                    </template>
                </z-column>
                <z-column label="状态" width="100">
                    <template slot-scope="scope">
                        <k-thing-status :value="scope.row"></k-thing-status>
                    </template>
                </z-column>
                <z-column label="阶段" width="120">
                    <template slot-scope="scope">
                        <ProjectSection :sections="sections" :value="scope.row.tag"/>
                    </template>
                </z-column>
                <z-column label="操作" width="80">
                    <template slot-scope="scope">
                        <z-confirm type="link" tip="确定删除吗？" @click="remove(scope.row._id)">删除</z-confirm>
                    </template>
                </z-column>
            </z-table>
            <z-pagination v-if="total>0" style="text-align: center;margin-top: 12px"
                          background :current-page="page + 1"
                          :page-size="params.size" :total="total"
                          @current-change="jump" layout="total, prev, pager, next"/>
        </div>
    </z-scrollbar>
</template>
<script>
    import ProjectFilter from "./filter"
    import ProjectSection from "./section"

    export default {
        props: ["value"],
        components: {ProjectFilter, ProjectSection},
        data() {
            return {
                list: [],
                page: 0,
                now: 0,
                total: 0,
                sections: [],
                params: null
            }
        },
        created() {
            let project = this.value, projectId = project._id;
            if (project.board) {
                JSON.parse(project.board).forEach(item => this.sections.push({text: item.title, value: item.tag}));
            }
            this.params = {
                _id: projectId,
                size: 20
            };
            this.now = parseInt((new Date()).getTime() / 1000);
            this.load();
            $.on("projectList", this.load);
        },
        beforeDestroy() {
            $.off("projectList");
        },
        methods: {
            load(data) {
                let params = this.params;
                params.page = this.page;
                if (data) {
                    for (let key in data) {
                        params[key] = data[key];
                    }
                }
                $.get(params, "/project/searchThings.do", function (reback) {
                    let data = reback.data;
                    this.list = data.list;
                    this.total = data.total;
                }, this);
            },
            jump(page) {
                this.page = page;
                this.load();
            },
            detail(id) {
                $.emit('thingDetail', id);
            },
            remove(id) {
                $.get({_id: id}, "/thing/remove.do", function (reback) {
                    this.load();
                    $.notice("删除成功!", "success");
                }, this);
            }
        }
    }
</script>