<template>
    <el-row>
        <el-col :span="22">
            <label v-if="active" @click="show(1)">
                <el-input type="primary"  autosize  size="default" v-model="text"
                    placeholder="请在这里输入需要处理的事项，按shift+enter保存" @keyup.shift.enter="() => save(true)"
                    @keyup.esc.prevent.stop="hide" />
            </label>
            <div v-else :class="'title ' + data.tag" @click="show(1)">
                <z-icon value="flag" />
                {{ data.title }}
            </div>
        </el-col>
        <el-col :span="2">
            <el-button v-if="active" type="primary" @click="save">
                <z-icon value="check" />
            </el-button>
            <z-icon v-else @click="show(0)" class="hover" value="edit" />
        </el-col>
    </el-row>
</template>
<script>
export default {
    props: {
        data: Object,
    },
    data() {
        return {
            text: "",
            isBlur: true,
            active: false,
        };
    },
    methods: {
        hide() {
            this.active = false;
        },
        show(type) {
            if (type === 0) {
                this.active = !this.active;
            } else {
                this.active = true;
            }
            if (this.active) {
                this.$nextTick(function () {
                    this.$el.querySelector("input").focus();
                });
            }
        },
        async save(noHide) {
            let title = this.text;
            if (!title) {
                return noHide !== true && this.hide();
            }
            let data = { title, quadrant: this.data.value };
            let thing = await $.post({ data, url: "/do/put/thing" }, this);
            thing.status = parseInt(thing.status);
            this.$emit("finish", thing);
            this.text = "";
            if (noHide === true) {
                return
            }
            this.hide();
        },
    },
};
</script>
<style lang="scss" scoped>
.a-row {
    line-height: 40px;
}

.a-col-2 {
    text-align: center;
    margin-left: -5px;
    z-index: 5;
}

.title {
    height: 40px;
    cursor: pointer;
    font-size: 16px;
    position: relative;
    color: var(--a-text-color-primary);

    .z-icon {
        position: absolute;
        left: 10px;
        top: 14px;
    }
}

.z-icon {
    margin-right: 12px;
}

.a {
    color: rgba(248, 14, 21, 0.9);
}

.b {
    color: #c6a815;
}

.c {
    color: rgba(0, 159, 227, 0.9);
}

.d {
    color: #75ad0b;
}
</style>
