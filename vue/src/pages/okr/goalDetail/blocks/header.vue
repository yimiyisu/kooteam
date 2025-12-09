<template>
  <el-row>
    <el-col :span="2">
      <z-avatar :value="value.owner" size="60px" />
    </el-col>

    <el-col :span="22">
      <el-row>
        <el-col :span="20">
          <span style="font-size: 18px; font-weight: 500">{{ value.title }}</span>
          <z-action icon="edit" link url="/do/patch/goal" :fields="titleFields" :data="value" />
        </el-col>
        <el-col :span="4">
          <z-action label="评分" mode="drawer">
            <Score :value="value" />
          </z-action>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="4">
          <z-dict code="goalType" :modelValue="value.type" :readonly="true" />
        </el-col>
        <el-col :span="12">
          {{ timeFormat(value.startGmt) }} - {{ timeFormat(value.endGmt) }}
        </el-col>
        <el-col :span="8">
          <div style="width: 150px">
            <Process :value="value" />
          </div>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>
<script>
import Process from './process.vue';
import Score from './score/score.vue';
export default {
  props: {
    value: Object
  },
  components: {
    Process, Score
  },
  data() {
    return {
      titleFields: [
        { name: 'title', label: '标题' }
      ]
    }
  },
  methods: {
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