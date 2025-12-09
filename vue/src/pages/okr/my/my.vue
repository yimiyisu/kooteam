<template>
  <z-table name="zeraerl7">
  </z-table>
  <Card />
  <Add @refresh="refresh" />
  <!-- 循环列表 -->
  <Tree v-for="item in treeData" :key="item.id" :treeData="item" class="tree" @refresh="refresh"/>
</template>

<script>
import { provide } from 'vue';
import configs from './.lowcode/configs'
import Card from './blocks/card.vue';
import Tree from './blocks/tree.vue';
import Add from './blocks/add.vue';
export default {
  name: 'p-zeraerl7',
  components: { Card, Tree, Add },
  setup() {
    provide('configs', configs)
  },
  data() {
    return {
      treeData: [],
    }
  },
  created() {
    this.getTreeData()
  },
  methods: {
    async getTreeData() {
      const tree = await $.post({ url: '/api/okr/owner' })
      // 转换数据结构
      const transformTreeData = (tree) => {
        return tree.map(item => ({
          ...item,
          children: item.krs || [] // 将 krs 数组映射为 children
        }));
      };
      this.treeData = transformTreeData(tree)
    },
    refresh() {
      this.getTreeData()
      // 刷新卡片数据
    }
  }
};
</script>
<style lang="scss" scoped>
</style>