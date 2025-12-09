<template>
  <z-block url="/do/list/thing_kr" :params="ids">
    <template #default="data">
      <el-table :data="data" :show-header="false">
        <el-table-column label="状态" prop="status">
          <template #default="prop">
            <z-dict :modelValue="prop.row.status" :readonly="true" code="thingStatus" />
          </template>
        </el-table-column>
        <el-table-column label="优先级" prop="quadrant">
          <template #default="prop">
            <z-dict :modelValue="prop.row.quadrant" :readonly="true" code="quadrantType" />
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" />
        <el-table-column label="负责人" prop="owner">
          <template #default="prop">
            <z-user :modelValue="prop.row.owner" :readonly="true" />
          </template>
        </el-table-column>
        <el-table-column label="截止时间" prop="end">
          <template #default="prop">
            {{ timeFormat(prop.row.end) }}
          </template>
        </el-table-column>
      </el-table>
    </template>
  </z-block>
</template>
<script>
export default {
  props: {
    params: Object
  },
  computed: {
    ids() {
      return this.params.things == null ? { ids: [] } : { ids: this.params.things }
    }
  },
  methods: {
    timeFormat(timestamp) {
      if (!timestamp) {
        timestamp = $.dayjs().unix() + 8 * 3600
      }
      return new Date(timestamp * 1000)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);
    }
  }
}
</script>