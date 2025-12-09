<template>
  <z-block url="/do/get/ai_week" :params="params">
    <template #default="data">
      <z-form :data="data" :fields="fields" url="/do/patch/ai_week">
        <template #recivers="row">
          <a-users label="抄送人" :value="row" name="recivers" />
        </template>
        <template #groups="row">
          <Group :value="row" />
        </template>
      </z-form>
    </template>
  </z-block>
</template>

<script>
import { provide } from 'vue';
import Group from '../send/blocks/group.vue';
import configs from './.lowcode/configs';

export default {
  inject: ['$map'],
  name: 'p-ccuv3klt',
  setup() {
    provide('configs', configs)
  },
  components: {
    Group
  },
  computed: {
    params() {
      return this.$map.id
    }
  },
  data() {
    return {
      fields: [
        { name: 'title', label: '标题' },
        { name: 'recivers' },
        { name: 'groups', label: '抄送组' },
        { name: 'reason', label: '失败原因', visible: (formData) => { return formData.status === 5 }, readonly: true },
        { name: 'content', label: '内容', type: 'tiptap', visible: (formData) => { return formData.status === 3 } },
      ]
    }
  }
}
</script>