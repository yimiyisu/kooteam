<template>
  <z-table name="dtnhb1im">
  </z-table>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs';
export default {
  name: 'p-dtnhb1im',
  setup() {
    provide('configs', configs)
  },
}
</script>