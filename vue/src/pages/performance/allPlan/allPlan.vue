<template>
  <z-table name="ltg1uswu" :submit="submit">
  </z-table>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs';
export default {
  name: 'p-ltg1uswu',
  setup() {
    provide('configs', configs)
  },
  methods: {
    submit(formData) {
      console.log(formData)
    }
  }
}
</script>