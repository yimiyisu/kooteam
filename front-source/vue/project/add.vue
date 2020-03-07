<template>
    <div>
        <z-select label="项目模版" :data="list" @change="change"
                  title-key="title"
                  value-key="key">
        </z-select>
        <input type="hidden" name="board" :value="JSON.stringify(process)"/>
        <div class="k-project-process" v-if="process.length>0">
            <p class="title">工作流程</p>
            <ul>
                <li v-for="item in process" :key="item.tag"><span class="item-name">{{item.title}}</span></li>
            </ul>
        </div>
    </div>
</template>
<script>
    import templates from "./template"

    export default {
        data() {
            return {
                list: templates,
                process: []
            }
        },
        methods: {
            change(val) {
                templates.forEach((item) => {
                    if (item.key === val) {
                        this.process = item.data;
                    }
                });
            }
        }
    }
</script>