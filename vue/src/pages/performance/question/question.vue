<template>
  <z-table name="7louqq4m" :entitys="entitys">
  </z-table>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs';
export default {
  name: 'p-7louqq4m',
  setup() {
    provide('configs', configs)
  },
  data() {
    return {
      entitys: {
        options: { visible: (formData) => { return formData.type === 1 || formData.type === 3 } }
      }
    }
  }
}
</script>