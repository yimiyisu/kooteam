<template>
    <z-dialog class="k-thing-detail-bg" top="5vh" width="800px" visible @close="close" v-if="isShow&&item">
        <z-row :gutter="18">
            <z-col :span="20">
                <Header v-model="item" :type="type"/>
                <Describe v-model="item" :type="type"/>
                <div class="infos">
                    <dl class="z-left" v-if="item.end">
                        <dt>
                            <i class="ft icon h1">&#xe706;</i>计划完成时间：
                        </dt>
                        <dd>
                            <z-idate :value="item.end"></z-idate>
                        </dd>
                    </dl>
                    <Owner/>
                    <Watcher/>
                    <Priority/>
                    <Clock/>
                </div>
                <Attach/>
                <SubTodo v-model="item"/>
                <Comment/>
            </z-col>
            <z-col :span="4">
                <Actions v-if="item"/>
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
    import Priority from "./detail/priority"
    import Clock from "./detail/clock"
    import Header from "./detail/header"
    import SubTodo from './detail/subTodo/index'
    import Attach from './detail/attach'
    import Actions from "./detail/actions/index"

    export default {
        props: ["quadrant", "type"],
        provide() {
            return {
                getThing: this.getThing,
                close: this.close,
                log: this.log,
                getType: this.getType
            }
        },
        data() {
            return {
                item: null,
                isShow: false
            }
        },
        components: {
            Comment,
            Describe,
            Header,
            Owner,
            Tag,
            Watcher,
            Priority,
            Clock,
            SubTodo,
            Attach,
            Actions
        },
        mounted() {
            $.on("thingDetail", this.init);
        },
        methods: {
            getThing() {
                return this.item;
            },
            getType() {
                return this.type
            },
            init(id) {
                let url = "/get/thingById.json";
                if (this.type === 1) {
                    url = "/thing/archive_get.do"
                }
                $.post({_id: id}, url, function (reback) {
                    let data = reback.data;
                    !data.end && (data.end = 0);
                    this.item = data;
                    this.isShow = true;
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