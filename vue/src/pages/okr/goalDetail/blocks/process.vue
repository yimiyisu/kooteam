<template>
  <z-action title="更新目标完成度" :fields="processFields" url="/api/okr/patchProcess"
    :data="{ id: value.id, status: value.status, process: value.process }">
    <template #label>
      <el-progress :text-inside="true" :stroke-width="strokeWidth" :percentage="value.process" />
    </template>
  </z-action>
</template>
<script>
export default {
  props: {
    value: Object,
    strokeWidth: {
      type: Number,
      default: 26
    }
  },
  data() {
    return {
      processFields: [
        { name: 'process', label: '完成度', type: 'number' },
        { name: 'status', label: '状态', code: 'goalStatus' },
        { name: 'content', label: '进展', type: 'textarea', placeholder: '请输入进展与障碍' }
      ]
    }
  }
}
</script>