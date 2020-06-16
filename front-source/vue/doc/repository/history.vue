<template>
    <z-tooltip content="历史版本">
        <z-popup title="文档历史版本" size="200px" type="text" @show="show">
            <i class="ft icon">&#xe73e;</i>
            <template #content>
                <z-table :data="list">
                    <z-column label="存档日期">
                        <template slot-scope="scope">
                            <z-idate :value="scope.row._id"></z-idate>
                        </template>
                    </z-column>
                    <z-column width="150px" label="操作">
                        <template slot-scope="scope">
                            <z-confirm type="link" @click="restore(scope.row)">恢复</z-confirm>
                        </template>
                    </z-column>
                </z-table>
            </template>
        </z-popup>
    </z-tooltip>
</template>
<script>
    export default {
        props: ["itemId"],
        data() {
            return {
                list: []
            }
        },
        methods: {
            async show() {
                this.list = await $.get({parentId: this.itemId}, "/select/noteLog.json");
            },
            async restore(item) {
                let detail = await $.get({_id: item._id}, "/get/noteLog.json");
                this.$parent.content = detail.content;
            }
        }
    }
</script>