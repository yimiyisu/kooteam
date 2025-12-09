<template>
  <!-- <z-table name="ory4dsyp">
  </z-table> -->
  <z-block url="/do/list/dimension" :params="params">
    <template #default="data">
      <z-action label="添加维度" url="/do/put/dimension" :fields="fields" :data="params" />
      <el-table :data="data">
        <el-table-column type="expand">
          <template #default="prop">
            <Questions :value="prop.row" />
          </template>
        </el-table-column>
        <el-table-column label="维度名称" prop="type" width="350">
          <template #default="prop">
            <z-dict :modelValue="prop.row.type" :readonly="true" code="dimension" />
          </template>
        </el-table-column>
        <el-table-column label="维度权重" prop="weight">
          <template #default="prop">
            {{ prop.row.weight }}%
          </template>
        </el-table-column>
        <el-table-column label="题目数量" prop="num" />
        <el-table-column width="80" align="right">
          <template #default="prop">
            <z-action :fields="fields" link icon="edit" url="/do/patch/dimension" :data="prop.row" />
            <z-action mode="confirm" title="确认删除吗？" link icon="trash2" url="/do/delete/dimension"
              :data="{ id: prop.row.id }" />
          </template>
        </el-table-column>
      </el-table>
    </template>
  </z-block>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs';
import Questions from './blocks/questions.vue';
export default {
  name: 'p-ory4dsyp',
  setup() {
    provide('configs', configs)
  },
  components: {
    Questions
  },
  props: {
    params: Object
  },
  data() {
    return {
      fields: [
        { name: 'type', label: '类型', code: 'dimension' },
        { name: 'weight', label: '权重', type: 'number' }
      ]
    }
  },
  methods: {
    submit(formData) {
      console.log(formData)
    }
  }
}
</script>