<template>
  <z-block url="/do/list/goal_kr" :params="params">
    <template #default="data">
      <el-table :data="data" :show-header="false">
        <el-table-column type="expand">
          <template #default="prop">
            <Things :params="prop.row" />
          </template>
        </el-table-column>
        <el-table-column type="index" :index="indexMethod" />
        <el-table-column label="标题" prop="title" width="650" />
        <el-table-column label="操作" prop="action">
          <template #default="prop">
            <z-action label="新建任务" link url="/api/okr/addThing" :fields="thingFields" :data="{ krId: prop.row.id }" />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </z-block>
</template>
<script>
import Things from './things.vue';
export default {
  components: {
    Things
  },
  props: {
    value: Object
  },
  data() {
    return {
      thingFields: [
        { name: 'title', label: '标题' },
        { name: 'content', label: '内容', type: 'tiptap' },
        { name: 'owner', label: '负责人', type: 'user' },
        { name: 'quadrant', label: '优先级', code: 'quadrantType' },
        { name: 'start', label: '开始时间', type: 'date' },
        { name: 'end', label: '结束时间', type: 'date' },
        { name: 'file', label: '附件', type: 'attach' }
      ]
    }
  },
  computed: {
    params() {
      return { parentId: this.value.id }
    }
  },
  methods: {
    indexMethod(index) {
      return 'KR' + (index + 1)
    },
  }
}
</script>