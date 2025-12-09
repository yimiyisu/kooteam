<template>
  <z-block url="/do/get/goal" :params="goalId">
    <template #default="data">
      <z-action label="编辑信息" :fields="baiscFields" url="/do/patch/goal" :data="data" />
      <el-descriptions :column="2">
        <el-descriptions-item label="周期">
          {{ timeFormat(data.startGmt) }} ~ {{ timeFormat(data.endGmt) }}
          <z-dict :modelValue="data.cycle" code="planCycle" :readonly="true" />
        </el-descriptions-item>
        <el-descriptions-item label="负责人">
          <z-user :modelValue="data.owner" :readonly="true" />
        </el-descriptions-item>
        <el-descriptions-item label="可见范围">
          <z-dict :modelValue="data.range" :readonly="true" code="visibleRange" />
        </el-descriptions-item>
        <el-descriptions-item label="类型">
          <z-dict :modelValue="data.type" :readonly="true" code="goalType" />
        </el-descriptions-item>
        <el-descriptions-item label="描述">
          <span>{{ data.description == null ? '暂无描述' : data.description }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <hr style="border: none; height: 8px; background-color: #e4e7ed; margin: 10px 0;">

      <el-row>
        <el-col :span="24">
          <h3>参与人</h3>
          <span v-for="item in data.participant" :key="item">
            <z-avatar :value="item" />
          </span>
          <z-action icon="edit" link url="/api/okr/addUsers" :fields="pFields"
            :data="{ participant: data.participant, id: params }" />
        </el-col>
      </el-row>
      <el-row>
        <h3>关注人</h3>
        <el-col :span="24">
          <span v-for="item in data.watchers" :key="item">
            <z-avatar :value="item" />
          </span>
          <z-action icon="edit" link url="/api/okr/addUsers" :fields="wFields"
            :data="{ watchers: data.wachers, id: params }" />
        </el-col>
      </el-row>
    </template>
  </z-block>
</template>
<script>
import Users from '@/components/users/users.vue';
export default {
  props: {
    params: Object
  },
  computed: {
    goalId() {
      return { id: this.params }
    }
  },
  data() {
    return {
      pFields: [
        { name: 'participant', label: '参与人', component: Users }
      ],
      wFields: [
        { name: 'watchers', label: '关注人', component: Users }
      ],
      baiscFields: [
        { name: 'owner', label: '负责人', type: 'user' },
        { name: 'cycle', label: '周期', code: 'planCycle' },
        { name: 'startGmt', label: '开始时间', type: 'date' },
        { name: 'endGmt', label: '结束时间', type: 'date' },
        { name: 'range', label: '可见范围', code: 'visibleRange' },
        { name: 'type', label: '类型', code: 'goalType' },
        { name: 'description', label: '描述', type: 'textarea' }
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