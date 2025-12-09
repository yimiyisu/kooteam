<template>
  <z-table name="gv1nenii">
  </z-table>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs';

export default {
  name: 'p-gv1nenii',
  setup() {
    provide('configs', configs)
  }
}
</script>