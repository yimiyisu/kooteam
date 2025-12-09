<template>
  <el-row class="row">
    <span style="font-size: 18px; font-weight: 500">{{ value.title }}</span>
    <z-action icon="edit" link url="/do/patch/goal" :fields="titleFields" :data="value" />
  </el-row>
  <el-row class="row">
    <el-col :span="3">负责人</el-col>
    <el-col :span="21">
      <z-user :modelValue="value.owner" />
    </el-col>
  </el-row>
  <el-row class="row">
    <el-col :span="3">KR完成度</el-col>
    <el-col :span="21">
      <div style="width: 200px">
        <Process :value="value" :strokeWidth="15" />
      </div>
    </el-col>
  </el-row>
  <el-row class="row">
    <el-col :span="3">起止时间</el-col>
    <el-col :span="21">
      {{ timeFormat(value.startGmt) }} ~ {{ timeFormat(value.endGmt) }}
      <z-action icon="edit" link url="/do/patch/goal" :fields="timeFields" :data="value" />
    </el-col>
  </el-row>
</template>
<script>
import Process from '../../goalDetail/blocks/process.vue';
export default {
  props: {
    value: Object
  },
  components: {
    Process
  },
  data() {
    return {
      titleFields: [
        { name: 'title', label: '标题' }
      ],
      timeFields: [
        { name: 'startGmt', label: '开始时间', type: 'date' },
        { name: 'endGmt', label: '结束时间', type: 'date' }
      ]
    }
  },
  methods: {
    timeFormat(timestamp) {
      if (!timestamp) {
        timestamp = $.dayjs().unix() + 8 * 3600
      }
      const date = new Date(timestamp * 1000)
      const isoString = date.toISOString()
      const datePart = isoString.split('T')[0]
      const [year, month, day] = datePart.split('-')
      return parseInt(year) + '/' + `${month}/${day}`
    }
  }
}
</script>
<style>
.row {
  margin-bottom: 10px;
}
</style>