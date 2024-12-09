<template>
  <z-form-item :value="value" name="todoGroup" :fields="fields" type="table" :autoId="true" label="待办分组" />
</template>
<script>
export default {
  props: {
    value: Object
  },
  data() {
    return {
      fields: [{ label: "分组名称", name: "title" }]
    }
  }
}
</script>