<template>
  <z-table name="qxod2vnd8hi">
    <template #userSlot="data">
      <a-users label="选择用户" :value="data" name="content" />
    </template>
  </z-table>
</template>

<script>
import configs from './.lowcode/configs';

export default {
  name: 'p-qxod2vnd8hi',
  provide: { configs },
  data() {
    return {}
  },
}
</script>