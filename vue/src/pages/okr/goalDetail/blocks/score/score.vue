<template>
  <z-block url="/do/list/goal_kr" :params="parentId">
    <template #default="data">
      <h3>o {{ value.title }}</h3>
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
              <z-avatar :value="value.owner" :plain="false" />
            </th>
            <th width="120">
              自评
            </th>
            <th width="120">-</th>
            <th>-</th>
            <th>-</th>
          </tr>

          <tr>
            <th width="180">
              <z-avatar :value="value.owner" :plain="false" />
            </th>
            <th width="120">
              主管
            </th>
            <th width="120">-</th>
            <th>-</th>
            <th>-</th>
          </tr>
        </tbody>
      </table>

      <!-- krs -->
      <KrScore :value="data" />
    </template>
  </z-block>
</template>

<script>
import KrScore from './krScore.vue';
export default {
  props: {
    value: Object
  },
  components: {
    KrScore
  },
  computed: {
    parentId() {
      return { parentId: this.value.id }
    }
  },
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