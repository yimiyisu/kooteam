<template>
  <z-table name="16xwzbmt">
    <template #title="{ row }">
      <a-thing :data="row" />
    </template>
  </z-table>
</template>

<script>
import configs from './.lowcode/configs'

export default {
  name: 'p-16xwzbmt',
  provide: { configs },
  data() {
    return {}
  },
}
</script>