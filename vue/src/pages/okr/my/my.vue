<template>
  <z-table name="zeraerl7">
  </z-table>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs'

export default {
  name: 'p-zeraerl7',
  setup() {
    provide('configs', configs)
  }
}
</script>
    