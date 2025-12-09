<template>
  <z-action ref="action" label="绑定题目" link :beforeSubmit="submit">
    <z-table v-model="selected" url="/do/select/question" :size="10" :columns="columns" :params="params"
      :selectable="true" />
  </z-action>
</template>
<script>
export default {
  provide() {
    return {
      configs: {},
    }
  },
  props: {
    value: Object
  },
  computed: {
    params() {
      return { evaluationId: this.value.evaluationId }
    }
  },
  data() {
    return {
      selected: [],
      columns: [
        { name: 'title', label: '标题' },
        { name: 'type', label: '类型', code: 'questionType' },
      ]
    }
  },
  methods: {
    submit() {
      const questions = this.selected.map(obj => obj.id);
      $.post({ url: '/do/patch/dimension', data: { questions: questions, id: this.value.id, num: questions.length } })
      this.$refs["action"].close();
    },
  }
}
</script>