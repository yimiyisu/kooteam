<template>
  <z-table name="0qpqiaqdoo6">
    <template #todoSlot="data">
      <TodoGroup :value="data" />
    </template>
    <template #fileSlot="data">
      <FileGroup :value="data" />
    </template>
  </z-table>
</template>

<script>
import configs from './.lowcode/configs';
import FileGroup from './blocks/fileGroup.vue';
import TodoGroup from './blocks/todoGroup.vue';

export default {
  name: 'p-0qpqiaqdoo6',
  components: { FileGroup, TodoGroup },
  provide: { configs },
  data() {
    return {}
  },
}
</script>