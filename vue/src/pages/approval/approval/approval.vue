<template>
  <z-table name="53zmh5sl">
    <template #AppSelect="data">
        <AppSelect :data="data"/>
    </template>
  </z-table>
</template>

<script>
import configs from './.lowcode/configs';
import AppSelect from './blocks/appSelect.vue';

export default {
  name: 'p-53zmh5sl',
    provide: { configs },
  components:{AppSelect},
  data() {
    return {}
  },
}
</script>
