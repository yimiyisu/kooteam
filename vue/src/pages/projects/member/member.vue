<template>
  <z-table name="tquveqrop7u" :entitys="entitys">
  </z-table>
</template>

<script>
import configs from './.lowcode/configs';

export default {
  name: 'p-tquveqrop7u',
    provide: { configs },
  data() {
      return {
        entitys:{
                role:{
                    name: "role",
                    default: 5
                }
            }
    }
  },
}
</script>