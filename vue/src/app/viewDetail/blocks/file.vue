<template>
  <el-row style="margin-top:12px">
    <el-col :span="1"><z-icon value="file" /> </el-col>
    <el-col :span="23">
        <!-- readonly没起作用 -->
      <z-form-item type="attach" name="file" label="附件" :value="value" readonly />
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
}
</script>

