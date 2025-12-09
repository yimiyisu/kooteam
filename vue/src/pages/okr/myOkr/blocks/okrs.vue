<template>
  <z-block url="/do/list/goal_owner_o">
    <template #default="data">
      <z-action label="创建目标" :fields="oFields" url="/do/put/goal_o" />
      <el-table :data="data" :border="parentBorder" :preserve-expanded-content="preserveExpanded" style="width: 100%">
        <el-table-column type="expand">
          <template #default="prop">
            <Krs :value="prop.row" :visible="false" />
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" />
        <el-table-column label="状态" prop="status">
          <template #default="prop">
            <z-dict code="goalStatus" :modelValue="prop.row.status" :readonly="true" />
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="type">
          <template #default="prop">
            <z-dict code="goalType" :modelValue="prop.row.type" :readonly="true" />
          </template>
        </el-table-column>
        <el-table-column label="进度" prop="process" width="200">
          <template #default="prop">
            <Process :value="prop.row" />
          </template>
        </el-table-column>
        <Action :href="'/okr/goalDetail'" />
      </el-table>
    </template>
  </z-block>
</template>

<script>
import Process from '../../goalDetail/blocks/process.vue';
import Action from './action.vue';
import Krs from './krs.vue';
export default {
  components: {
    Krs, Action, Process
  },
  data() {
    return {
      oFields: [
        { name: 'title', label: '目标' },
        { name: 'cycle', label: '周期', code: 'planCycle' },
        { name: 'startGmt', label: '开始时间', type: 'date' },
        { name: 'endGmt', label: '结束时间', type: 'date' }
      ],
      processFields: [
        { name: 'process', label: '完成度', type: 'number' },
        { name: 'status', label: '状态', code: 'goalStatus' },
        { name: 'content', label: '进展', type: 'textarea', placeholder: '请输入进展与障碍' }
      ]
    }
  },
}
</script>