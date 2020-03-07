<template>
    <z-popover v-model="visible" trigger="click">
        <z-employee :value="thing.owner" :max="1"></z-employee>
        <div class="z-detail-soperator">
            <z-button plain size="mini" @click="close">取消</z-button>
            <z-button size="mini" type="primary" @click="submit">确定</z-button>
        </div>
        <template slot="reference">
            <div class="btn">
                <i class="ft icon">&#xe6fd;</i>负责人
            </div>
        </template>
    </z-popover>
</template>
<script>
    export default {
        data() {
            return {
                thing: null,
                visible: false
            }
        },
        inject: ["getThing"],
        created() {
            this.thing = this.getThing();
        },
        methods: {
            close() {
                this.visible = false;
            },
            submit() {
                $.post({_id: this.thing._id, owner: this.thing.owner}, '/thing/patch.do', () => {
                    this.close();
                }, this)
            }
        }
    }
</script>