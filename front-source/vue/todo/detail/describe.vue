<template>
    <div class="describe">
        <z-row>
            <z-col :span="1"><i class="ft icon">&#xe75e;</i></z-col>
            <z-col :span="23">
                <div class="title"><strong>描述</strong></div>
                <textarea placeholder="添加详细描述..." @change="change" v-model="value.content"></textarea>
            </z-col>
        </z-row>
    </div>
</template>
<script>

    export default {
        name: "detailDescribe",
        props: ["value"],
        methods: {
            change() {
                let url = '/thing/patch.do';
                $.post({
                    content: this.value.content,
                    _id: this.value._id
                }, url)
            }
        }
    }
</script>