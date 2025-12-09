<template>
  <z-table name="8ygt56lk" :entitys="entitys">
    <template #recieversSlot="data">
      <a-users label="抄送人" :value="data" name="recivers" />
    </template>
    <template #groupSlot="data">
      <Group :value="data" />
    </template>
  </z-table>
</template>

<script>
import { provide } from 'vue';
import Group from '../send/blocks/group.vue';
import configs from './.lowcode/configs';

export default {
  name: 'p-8ygt56lk',
  setup() {
    provide('configs', configs)
  },
  components: { Group },
  data() {
    return {
      entitys: {
        "group": { visible: (formData) => { return formData.type === 3 } },
        "content": { type: 'tiptap' }
      }
    }
  }
}
</script>