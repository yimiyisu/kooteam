<template>
  <z-dialog top="5vh" title="新增任务" width="600px" visible @close="close" v-if="isShow">
    <z-form>
      <z-input koo="need" style="width: 510px" name="title" label="任务标题" type="text"></z-input>
      <z-tcode code="priority" :value="b" name="tag" label="优先级" type="radio"></z-tcode>
      <z-date
        koo="need"
        label="计划时间"
        type="datetimerange"
        @confirm="selectDate"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :default-time="['9:00:00', '12:00:00']"
        :value="range"
      ></z-date>
      <z-employee label="负责人" name="owner" :max="1"></z-employee>
      <z-select v-if="sections.length>0" name="section" label="所属阶段" :data="sections"></z-select>
      <z-field>
        <z-submit :callback="callback" action="/thing/put.do">保存</z-submit>
        <z-button @click="close">取消</z-button>
      </z-field>
    </z-form>
  </z-dialog>
</template>
<script>
export default {
  data() {
    return {
      isShow: false,
      sections: [],
      range: [],
      start: "",
      end: ""
    };
  },
  created() {
    $.on("thingAdd", this.init);
  },
  methods: {
    init(params) {
      if (this.isShow) {
        return;
      }
      this.title = "";
      this.range = params.range || [];
      this.sections = params.sections || [];
      this.isShow = true;
    },
    selectDate(val) {
      debugger;
      if (!val || val.length < 2) {
        return;
      }
      this.start = val[0];
      this.end = val[0];
    },
    callback(reback) {
      debugger;
      $.emit("thingUpdate", reback.data, "add");
    },
    close() {
      this.isShow = false;
    }
  }
};
</script>