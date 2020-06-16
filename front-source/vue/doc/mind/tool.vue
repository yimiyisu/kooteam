<template>
  <div class="tool" :style="style">
    <span class="ft icon" @click="add" title="添加" v-if="!readonly">&#xe6c2;</span>
    <span class="ft icon" @click="edit" title="编辑" v-if="!readonly">&#xe88e;</span>
    <span class="ft icon" @click="remove" title="删除" v-if="!readonly">&#xe70a;</span>
  </div>
</template>
<script>
import Config from "./util/config";

export default {
  data: function() {
    return {
      isShow: false,
      readonly: false,
      style: ""
    };
  },
  mounted: function() {
    let context = this.$parent,
      that = this;
    context.$on("showTool", function(status, node) {
      that.init(status, node);
    });
  },
  methods: {
    add: function(evt) {
      evt.stopPropagation();
      $.emit("mindEvt", "addNode", true);
    },
    remove: function(evt) {
      evt.stopPropagation();
      $.emit("mindEvt", "removeNode", true);
    },
    edit: function(evt) {
      evt.stopPropagation();
      let context = this.$parent;
      context.emitEditor(true);
    },
    init: function(status, node) {
      if (!status) {
        if (this.isShow === false) {
          return;
        }
        this.isShow = false;
        return (this.style = Config.hideStyle);
      }
      this.readonly = this.$parent.readonly;
      this.isShow = true;
      let box = node.getBBox();
      let y = box.y - Config.elHeight;
      this.style = "left:" + box.x + "px;top:" + y + "px";
    }
  }
};
</script>