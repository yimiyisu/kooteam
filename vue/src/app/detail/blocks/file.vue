<template>
  <el-row style="margin-top:12px">
    <el-col :span="1"><z-icon value="file" /> </el-col>
    <el-col :span="23">
      <z-form-item type="attach" name="file" label="添加附件" :value="value" :onChange="change" />
    </el-col>
  </el-row>
</template>
<script>
export default {
  props: { value: Object },
  data() {
    return {
      fileList: []
    }
  },
  methods: {
    change(value, formData) {
      formData.file = value.path
    }
  }
}
</script>