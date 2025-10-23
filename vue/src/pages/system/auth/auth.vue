<template>
  <z-table name="8eyu4kg3">
      <template #authLink="formData">
          <AuthLink :data="formData" />
      </template>
  </z-table>
</template>

<script>
import configs from './.lowcode/configs'
import AuthLink from "./blocks/authLink.vue";

export default {
  name: 'p-8eyu4kg3',
  provide: { configs },
    components: {AuthLink},
  data() {
    return {}
  },
}
</script>
