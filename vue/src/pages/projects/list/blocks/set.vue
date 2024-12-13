<template>
  <z-action
    icon="settings"
    type="default"
    :beforeShow="show"
    link
    mode="drawer"
    title="项目设置"
  >
    <el-tabs v-model="current">
      <el-tab-pane label="项目成员" name="member">
        <z-block href="/projects/member" :params="params" />
      </el-tab-pane>
      <el-tab-pane label="待办分组" name="todo" lazy>
        <z-form
          :fields="todoFields"
          url="/do/patch/project"
          :data="projectData"
        >
          <template #todoGroup="formData">
            <TodoGroup :value="formData" />
          </template>
        </z-form>
      </el-tab-pane>
      <el-tab-pane label="附件分组" name="file" lazy>
        <z-form
          :fields="fileFields"
          url="/do/patch/project"
          :data="projectData"
        >
          <template #fileGroup="formData">
            <FileGroup :value="formData" />
          </template>
        </z-form>
      </el-tab-pane>
      <el-tab-pane label="其他设置" name="other" lazy>
        <z-form
          :fields="basicFields"
          url="/do/patch/project"
          :data="projectData"
        >
          <template #quit>
            <el-form-item label="退出项目">
              <z-action
                label="退出"
                title="确定退出该项目吗?"
                url="/do/delete/projectUserForQuit"
                type="danger"
                :data="params"
                mode="confirm"
              />
            </el-form-item>
          </template>
        </z-form>
      </el-tab-pane>
    </el-tabs>
  </z-action>
</template>
<script>
import FileGroup from '../../template/blocks/fileGroup.vue'
import TodoGroup from '../../template/blocks/todoGroup.vue'
export default {
  components: { FileGroup, TodoGroup },
  props: {
    value: Object,
  },
  data() {
    return {
      current: 'member',
      params: null,
      projectData: null,
      todoFields: ['todoGroup'],
      fileFields: ['fileGroup'],
      basicFields: ['title', 'knowledge', 'quit'],
    }
  },
  methods: {
    async show() {
      const { id } = this.value

      this.params = { projectId: id }
      this.projectData = await $.get({
        url: '/do/get/project',
        data: { id },
      })
    },
  },
}
</script>
