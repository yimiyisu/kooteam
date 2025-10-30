<template>
  <z-table name="ibdcjjen">
  </z-table>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs'

export default {
  name: 'p-ibdcjjen',
  setup() {
    provide('configs', configs)
  }
}
</script>
    