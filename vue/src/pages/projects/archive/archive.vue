<template>
    <el-tabs v-model="activeName" type="card" @tab-change="change">
   <el-tab-pane label="我负责的" name="onwer"></el-tab-pane>
   <el-tab-pane label="我归档的" name="created"></el-tab-pane>
 </el-tabs>
   <z-table name="52bjjipl1oa" :url="url">
       <template #title="{ row }">
     <a-thing :data="row" />
   </template>
   </z-table>
</template>

<script>
import configs from './.lowcode/configs';
const defaultURL='/do/select/myArchive'
export default {
   name: 'p-52bjjipl1oa',
   provide: { configs },
   data() {
       return {
           activeName: 'onwer', url: defaultURL 
           // url:'/do/select/myArchive'
       }
   },
   methods: {
   change() {
     this.url = this.activeName === 'onwer' ? defaultURL : '/do/select/createdArchive'
   }
}
}
</script>