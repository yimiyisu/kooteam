<template>
  <z-block url="/do/list/goal_kr" :params="params">
    <template #default="data">
      <z-action url="/do/put/goal_kr" :beforeSubmit="submit" label="添加kr" :fields="krFields" :data="params" />
      <el-table :data="data" :show-header="false">
        <el-table-column type="index" :index="indexMethod" />
        <el-table-column prop="title" width="400">
          <template #default="prop">
            <el-row>
              <el-col>
                <h3>{{ prop.row.title }}</h3>
              </el-col>
            </el-row>
            <el-row v-if="visible">
              <el-col class="info" :span="5"><z-user :modelValue="prop.row.owner" :readonly="true" /></el-col>
              <el-col class="info" :span="19">{{ timeFormat(prop.row.startGmt) }} ~ {{ timeFormat(prop.row.endGmt)
              }}</el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column prop="owner">
          <template #default="prop">
            <z-user :modelValue="prop.row.owner" :readonly="true" />
          </template>
        </el-table-column>
        <el-table-column prop="process">
          <template #default="prop">
            <el-progress type="dashboard" :percentage="prop.row.process" width="50">
              <template #default="{ percentage }">
                <span class="percentage-value">{{ percentage }}%</span>
              </template>
            </el-progress>
          </template>
        </el-table-column>
        <Action :href="'/okr/krDetail'" />
      </el-table>
    </template>
  </z-block>
</template>
<script>
import Action from './action.vue';
export default {
  components: {
    Action
  },
  props: {
    value: Object,
    visible: Boolean,
  },
  computed: {
    params() {
      return { parentId: this.value.id }
    }
  },
  data() {
    return {
      krFields: [
        { name: 'title', label: 'kr' }
      ]
    }
  },
  methods: {
    submit(formData) {
      formData.startGmt = this.value.startGmt
      formData.endGmt = this.value.endGmt
      return formData
    },
    indexMethod(index) {
      return 'KR' + (index + 1)
    },
    timeFormat(timestamp) {
      if (!timestamp) {
        timestamp = $.dayjs().unix() + 8 * 3600
      }
      return new Date(timestamp * 1000)
        .toISOString()
        .replace('T', ' ')
        .slice(0, 19);
    }
  }
}
</script>
<style>
.info {
  font-size: 10px;
}
</style>