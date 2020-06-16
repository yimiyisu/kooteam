<template>
    <z-dialog class="k-thing-detail-bg" top="5vh" width="800px" visible @close="close" v-if="isShow&&item">
        <z-row :gutter="18">
            <z-col :span="20">
                <Header v-model="item" :readonly="!!archiveId"/>
                <Describe v-model="item" :readonly="!!archiveId"/>
                <div class="infos">
                    <dl class="z-left" v-if="item.end">
                        <dt>
                            <i class="ft icon h1">&#xe706;</i>计划时间：
                        </dt>
                        <dd>
                            <z-idate :value="item.start"></z-idate>
                            至
                            <z-idate :value="item.end"></z-idate>
                            <span v-if="overtime" class="ft red">&nbsp;(已超时)</span>
                        </dd>
                    </dl>
                    <Owner/>
                    <Watcher/>
                    <dl class="z-left">
                        <dt><i class="ft icon h1">&#xe725;</i>优先级：</dt>
                        <dd>
                            <z-tcode code="priority" :value="item.quadrant"/>
                        </dd>
                    </dl>
                    <dl class="z-left">
                        <dt><i class="ft icon h1">&#xe6af;</i>状态：</dt>
                        <dd>
                            <k-thing-status :value="item"/>
                        </dd>
                    </dl>
                    <!--                    <Clock/>-->
                </div>
                <Attach/>
                <SubTodo :archiveId="archiveId" v-model="item"/>
                <Comment/>
            </z-col>
            <z-col :span="4">
                <Actions v-if="item" :archiveId="archiveId"/>
            </z-col>
        </z-row>
    </z-dialog>
</template>
<script>
    import Comment from "./detail/comment"
    import Describe from "./detail/describe"
    import Owner from "./detail/owner"
    import Watcher from "./detail/watcher"
    // import SubThing from "./detail/subThing"
    // import Plan from "./detail/plan"
    import Tag from "./detail/tag"
    import Header from "./detail/header"
    import SubTodo from './detail/subTodo/index'
    import Attach from './detail/attach'
    import Actions from "./detail/actions/index"

    export default {
        props: ["quadrant"],
        provide() {
            return {
                getThing: this.getThing,
                close: this.close,
                log: this.log
            }
        },
        data() {
            return {
                item: null,
                isShow: false,
                overtime: false,
                archiveId: null
            }
        },
        components: {
            Comment,
            Describe,
            Header,
            Owner,
            Tag,
            Watcher,
            SubTodo,
            Attach,
            Actions
        },
        created() {
            $.on("thingDetail", this.init);
        },
        methods: {
            getThing() {
                return this.item;
            },
            init(id, type) {
                if (this.isShow) {
                    return;
                }
                let url = "/get/thingById.json";
                if (type === 1) {
                    this.archiveId = id;
                    url = "/get/archiveById.json"
                } else {
                    this.archiveId = null;
                }
                $.post({_id: id}, url, function (reback) {
                    let data = type === 1 ? JSON.parse(reback.data.content) : reback.data;
                    !data.end && (data.end = 0);
                    this.item = data;
                    this.isShow = true;
                    // 当前时间
                    let now = new Date();
                    now = parseInt(now.getTime() / 1000);
                    this.overtime = data.status === 0 && data.end && data.end < now;
                }, this);
            },
            log(content) {
                $.post({thingId: this.item._id, content: content}, '/put/thingLog.json', function (reback) {
                });
            },
            close() {
                this.isShow = false;
            }
        }
    }
</script>