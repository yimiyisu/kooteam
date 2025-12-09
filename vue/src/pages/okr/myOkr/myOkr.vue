<template>
  <!-- <z-table name="uermyhs9">
  </z-table> -->
  <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
    <el-tab-pane label="我负责的" name="owner">
      <Orks />
    </el-tab-pane>
    <el-tab-pane label="我参与的" name="part">我参与的</el-tab-pane>
    <el-tab-pane label="我关注的" name="concern">我关注的</el-tab-pane>
  </el-tabs>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs';
import Orks from './blocks/okrs.vue';
export default {
  name: 'p-uermyhs9',
  setup() {
    provide('configs', configs)
  },
  components: {
    Orks
  },
  data() {
    return {
      activeName: 'owner'
    }
  }
}
</script>