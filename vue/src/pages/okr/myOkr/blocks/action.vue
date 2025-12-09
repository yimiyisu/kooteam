<template>
  <el-table-column width="80" align="right">
    <template #default="prop">
      <z-action mode="drawer" link icon="edit" :href="href" :data="{ id: prop.row.id }" :map="{ 'id': 'id' }" />
      <z-action mode="confirm" title="确认删除吗？" link icon="trash2" url="/do/delete/goal" :data="{ id: prop.row.id }" />
    </template>
  </el-table-column>
</template>
<script>
export default {
  props: {
    href: String
  }
}
</script>