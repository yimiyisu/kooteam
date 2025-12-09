<template>
  <z-block url="/do/list/question_ids" :params="value">
    <template #default="data">
      <Select :value="value" />
      <el-table :data="data" :show-header="false">
        <el-table-column label="标题" prop="title" width="200" />
        <el-table-column label="类型" prop="type" width="50">
          <template #default="prop">
            <z-dict :modelValue="prop.row.type" :readonly="true" code="questionType" />
          </template>
        </el-table-column>
        <el-table-column label="分数" prop="score">
          <template #default="prop">
            {{ prop.row.score }}分
          </template>
        </el-table-column>
        <el-table-column width="80" align="right">
          <template #default="prop">
            <z-action mode="confirm" title="确认删除吗？" link icon="trash2" url="/api/evaluation/delRelationship"
              :data="{ questionId: prop.row.id, dimensionId: value.id, questions: value.questions }" />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </z-block>
</template>
<script>
import Select from './questionSelect.vue';
export default {
  props: {
    value: Object
  },
  components: {
    Select
  },
}
</script>