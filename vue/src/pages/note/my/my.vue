<template>
  <z-table name="599g7fd6qiv">
    <template #default="{ row }">
      <Card :value="row" />
    </template>
  </z-table>
  <Detail />
</template>

<script>
import configs from './.lowcode/configs';
import Card from './blocks/card.vue';
import Detail from './blocks/detail/index.vue';

export default {
  name: 'p-599g7fd6qiv',
  components: { Card, Detail },
  provide: { configs },
  data() {
    return {}
  },
}
</script>