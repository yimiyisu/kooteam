<template>
  <el-dropdown-item>
    <z-action link v-if="profile.role === 5" width="800" from="/api/system/mods" :fields="fields" url="/api/system/mods"
      label="微模块" />
  </el-dropdown-item>
</template>
<script>
export default {
  inject: ["profile"],
  data() {
    return {
      fields: [{
        name: "modules",
        type: "table",
        fields: [
          { label: "模块名", name: "name", width: 150 },
          { label: "模块版本", name: "version", width: 120 },
          { label: "服务地址", name: "api" }
        ]
      }]
    }
  }
}
</script>