<template>
  <z-block url="/do/get/goal" :params="params">
    <template #default="data">
      <div v-if="!data.progress">暂无数据</div>

      <div v-for="item in data.progress" :key="item.id" class="progress-item" style="max-width: 480px">
        <z-avatar :value="item.creator" :plain="false" />
        <div style="margin-left: 11px;">
          <span class="preprocess">{{ item.preProcess }}% </span> ->
          <span class="process">{{ item.process }}%</span>
        </div>

        <div class="content-hover-area" @mouseenter="hoverItemId = item.id" @mouseleave="hoverItemId = null">
          <div class="content-text">{{ item.content }}</div>
          <div class="bottom-row">
            <div class="time-text">{{ timeFormat(item.createGmt) }}</div>
            <div class="edit-btn" v-show="hoverItemId === item.id">
              <z-action label="编辑" link url="/api/okr/editProgress" :fields="fields"
                :data="{ item: item, goalId: params.id, content: item.content }" />
            </div>
          </div>
        </div>
      </div>
    </template>
  </z-block>
</template>

<script>
export default {
  props: {
    params: Object
  },
  data() {
    return {
      hoverItemId: null,
      fields: [
        { name: 'content', label: '进展', type: 'textarea', placeholder: '请输入进展与障碍' }
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

<style scoped>
.progress-item {
  margin-bottom: 12px;
  padding: 12px;
}

.content-hover-area {
  position: relative;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  margin-top: 8px;
}

.content-hover-area:hover {
  background-color: #f5f7fa;
}

.content-text {
  margin-bottom: 4px;
}

.bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-text {
  font-size: 12px;
  color: #909399;
}

.preprocess {
  font-size: 15px;
  font-weight: bold;
  color: #6f6f6f;
}

.process {
  font-size: 15px;
  font-weight: bold;
  color: #6c99f4
}
</style>