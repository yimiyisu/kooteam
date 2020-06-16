<template>
    <span @click="init">
        <slot></slot>
        <z-dialog custom-class="k-report" v-if="isShow"
                  width="80%" top="20px" @close="close">
            <Writer v-if="type==='new'||type==='edit'" :data="report"></Writer>
            <!--<Set v-if="type==='put'"></Set>-->
            <Preview v-if="type==='view'" :data="report"></Preview>
        </z-dialog>
    </span>
</template>
<script>
    import Preview from "./view"
    import Writer from "./writer"

    export default {
        props: ["type", "id"],
        components: {Writer, Preview},
        data() {
            return {
                report: null,
                isShow: false
            };
        },
        methods: {
            init() {
                let id = this.id, type = this.type;
                if (type === "new") {
                    this.report = {_id: "", type: "1", title: "", readers: "", mails: ""};
                }
                if (id) {
                    $.post({_id: id}, "/report/detail.do", function (reback) {
                        this.report = reback.data;
                        this.isShow = true;
                    }, this);
                } else {
                    this.isShow = true;
                }
            },
            close() {
                if (this.type === "set") {
                    return this.type = "new";
                }
                this.isShow = false;
            }
        }
    }
</script>