<template>
    <div class="a-card is-hover-shadow">
        <div class="title">
            <el-text class="title-container">
                <div class="left-items">
                <z-icon @click="favi" value="star" :style="'--color: var(' + color + ')'" class="hover star" />
                <span @click="detail(value.id)" class="hover">{{ value.title }}</span>
                </div>
                <z-icon @click="exit(value)" value="logOut" class="exit-icon"/>
            </el-text>
        </div>
        <div class="more">
            <div class="left">
                <z-dict code="noteUserType" readonly :modelValue="value.typeLeft" />
            </div>
            <div class="right">
                <Quit v-if="value.type === 3" :noteId="value.id" />
                <Set v-else :value="value" />
            </div>
        </div>
    </div>
</template>
<script>
import Quit from './quit.vue';
import Set from './set.vue';
export default {
    components: { Set, Quit },
    props: {
        value: Object
    },
    computed: {
        color() {
            const { tagLeft } = this.value
            return tagLeft ? '--a-color-primary' : '--a-text-color-placeholder'
        }
    },
    methods: {
        detail(id) {
            $.emit("noteDetail", { id })
        },
        async favi() {
            const { idLeft, tagLeft } = this.value
            const newTag = tagLeft ? 0 : 1
            await $.post({ url: '/do/patch/note_user', data: { tag: newTag, id: idLeft } })
            this.value.tagLeft = newTag
        },
        async exit(value) {
            const { relateId } = value.idLeft;
            $.confirm("确定退出知识库吗？",
                async () => {
                    if (value.typeLeft == 9) {
                        $.fail("管理员不能退出知识库")
                        return
                    }
                    await $.post({ url: '/do/delete/note_user', data: { id: relateId } })
                },
            )
        }
    },
}
</script>
<style scoped lang="scss">
.a-card {
    display: inline-block;
    width: 320px;
    margin: 0 20px 20px 0;
}

.title {
    height: 60px;
    font-size: var(--a-font-size-medium);
    margin: 8px 12px;
    overflow: hidden;

    .a-text {
        cursor: pointer;
    }
}

.title-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.left-items {
  display: flex;
  align-items: center;
  overflow: hidden;
  flex: 1;

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
  }
}

.exit-icon {
  flex-shrink: 0;
  margin-left: 10px;
}

.more {
    border-top: 1px solid var(--a-card-border-color);
    padding: 8px 12px;
    color: var(--a-text-color-secondary);
    display: flex;
}

.left {
    flex: 1
}

.right {
    width: 60px;
    text-align: right;
}

.star {
    padding: 2px 6px 0 0;
}
</style>