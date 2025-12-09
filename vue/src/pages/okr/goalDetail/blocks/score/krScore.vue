<template>
  <div v-for="(item, index) in value" :key="item.id">
    <h3>KR{{ index + 1 }} {{ item.title }}</h3>
    <table class="custom-table">
      <thead>
        <tr>
          <th width="180">评分人</th>
          <th width="120">身份</th>
          <th width="120">评分</th>
          <th>评分说明</th>
          <th>操作</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <th width="180">
            <z-avatar :value="item.owner" :plain="false" />
          </th>
          <th width="120">
            自评
          </th>
          <th width="120">
            <span v-if="item.scoreSelf == null">-</span>
            <z-dict v-else :modelValue="item.scoreSelf" code="scoreType" :readonly="true" />
          </th>
          <th>
            <span v-if="item.scoreSelf == null">-</span>
            <span v-else>{{ item.selfDesc }}</span>
          </th>
          <th><z-action label="编辑评分" url="/do/patch/goal_self" :fields="selfFields" :data="item" /></th>
        </tr>

        <tr>
          <th width="180">
            <span v-if="item.superUid == null">-</span>
            <z-avatar v-else :value="item.superUid" :plain="false" />
          </th>
          <th width="120">
            主管
          </th>
          <th width="120">
            <span v-if="item.scoreSuper == null">-</span>
            <z-dict v-else :modelValue="item.scoreSuper" :readonly="true" code="scoreType" />
          </th>
          <th>
            <span v-if="item.superDesc == null">-</span>
            <span v-else>{{ item.superDesc }}</span>
          </th>
          <th><z-action label="编辑评分" url="/do/patch/goal_super" :fields="superFields" :data="item" /></th>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  props: {
    value: Object
  },
  data() {
    return {
      selfFields: [
        { name: 'scoreSelf', label: '分数', code: 'scoreType' },
        { name: 'selfDesc', label: '说明', type: 'textarea' }
      ],
      superFields: [
        { name: 'scoreSuper', label: '分数', code: 'scoreType' },
        { name: 'superDesc', label: '说明', type: 'textarea' }
      ]
    }
  }
}
</script>
<style scoped>
.custom-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.custom-table th {
  background: #f8f9fa;
  padding: 16px 20px;
  text-align: left;
  font-weight: 500;
  color: #333;
  border-bottom: 1px solid #eaeaea;
}

.custom-table td {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.custom-table tr:last-child td {
  border-bottom: none;
}
</style>