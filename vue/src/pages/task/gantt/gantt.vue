<!-- eslint-disable -->
<template>
  <div class="bg-ff">
    <div class="Gantt-header">
      <div class="Gantt-header_flex">
        <div class="Gantt-View_Div">
          <p class="toggle-button Gantt-View_p" @click="GanttView">{{ viewText }}</p>
          <ul class="Gantt-View_opacity toggle-menu" v-if="isToggleMenu">
            <li :class="activeClass == index ? 'active' : ''" v-for="(item, index) in viewNames" :key="index"
              @click="GanttViewId(index, item.name)">{{ item.name }}</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="Gantt-table_flex">
      <div class="Gantt-table_left">
        <div class="Gantt-table_left_title">
          <div>id</div>
          <div>任务名称</div>
          <div>负责人</div>
        </div>
        <div id="taskAryy" v-for="(item, index) in taskList" :key="index">
          <div class="Gantt-table_left_list">
            <div class="Gantt-table_left_intro">
              <p>{{ item.id }}</p>
            </div>
            <div class="Gantt-table_left_intro">
              <p>{{ item.taskName }}</p>
            </div>
            <div class="Gantt-table_left_intro">
              <p>{{ item.name }}</p>
            </div>
          </div>
        </div>
      </div>
      <div class="Gantt-table_right">
        <div class="Gantt-table_right_rew">
          <div class="tableYear" ref="tableYear" v-if="activeClass == 0">
            <p v-for="(item) in MothY" class="Gantt-table_header" :style="{ width: item.width }">
              {{ item.name }}
            </p>
          </div>
          <div class="tableYear" ref="tableYear" v-else="activeClass==1">
            <template v-for="(item, index) in MothY1">
              <p class="" :style="{ width: item.width }">
                {{ item.name }}
              </p>
            </template>
          </div>
          <div class="tableDay" ref="tableDay">
            <template v-for="(item, index) in getActiveClassData()">
              <p :class="[item.isToday ? 'today' : '', item.bool ? 'Gantt-table_weekend' : '']"
                :style="{ width: item.width }" :ref="item.isToday ? 'today' : 'null'">
                {{ item.name }}{{ getMonthSuffix(item) }}
              </p>
            </template>

          </div>

          <div id="taskBarAryy">
            <div class="tableList" :style="tableListStyles" v-for="(item, index) in taskList" :key="index">
              <div class="tableBar" :style="{
                width: item.offsetwidth,
                left: item.leftwidth,
                background: '#' + (Math.random() * 0x1000000 << 0).toString(16).slice(-6)
              }"></div>
              <p class="tableNameintro" :style="{
                left: item.tableNameintroWidth,
              }">{{ item.taskName }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 参考jquery版本
export default {
  name: 'APP',
  data() {
    var currentDate = new Date;//当前日期
    var currentYear = currentDate.getFullYear();//当前年份
    var yearRange = 1; // 前后1年
    var startDate = currentYear - yearRange;//前1年
    var endDate = currentYear + yearRange;//后1年
    var today = currentDate.getDate(); // 获取今天是几号
    var currentMonth = currentDate.getMonth();//月
    var displayedYears = {}; // 用于记录已显示的年份
    return {
      currentDate,//当前日期
      currentYear,//当前年份
      yearRange, // 前后1年
      startDate,//前1年
      endDate,//后1年
      today, // 获取今天是几号
      currentMonth,//月
      displayedYears, // 用于记录已显示的年份
      viewNames: [
        { "id": "0", "name": "日视图" },
        { "id": "1", "name": "月视图" },
        { "id": "2", "name": "季度视图" },
        { "id": "3", "name": "年度视图" },
      ],
      quarters: ["第一季度", "第二季度", "第三季度", "第四季度"],//季度标识
      Annuals: ["上半年", "下半年"], // 年度标识
      activeClass: 0,
      viewText: "日视图",
      taskList: [
        { "id": "1", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-8-10", "dateClosed": "2023-8-12" },
        { "id": "2", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-8-12", "dateClosed": "2023-8-15" },
        { "id": "3", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-8-15", "dateClosed": "2023-8-18" },
        { "id": "4", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-8-10", "dateClosed": "2023-8-25" },
        { "id": "5", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-8-1", "dateClosed": "2023-8-25" },
        { "id": "6", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-1-10", "dateClosed": "2023-1-25" },
        { "id": "7", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-2-10", "dateClosed": "2023-2-25" },
        { "id": "8", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-3-10", "dateClosed": "2023-3-25" },
        { "id": "9", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-4-10", "dateClosed": "2023-4-25" },
        { "id": "10", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-5-10", "dateClosed": "2023-5-25" },
        { "id": "11", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-6-10", "dateClosed": "2023-6-25" },
        { "id": "12", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-7-10", "dateClosed": "2023-7-25" },
        { "id": "13", "taskName": "前端页面编写", "name": "某某某", "startDate": "2023-11-17", "dateClosed": "2023-11-25" },
      ],
      isToggleMenu: false,
      dateRange: [],
      MothY: [],//年-月
      MothY1: [],//年
      dayView: [],//日视图
      monthView: [],//月视图
      quarterView: [],//季度视图
      yearView: [],//年度视图
      width: 0,
      newW: 0,

    }
  },
  computed: {
    tableListStyles() {
      return {
        width: this.width + 'px',
        background: `repeating-linear-gradient(to right, #DDDDDD, #DDDDDD 1px, transparent 1px, transparent ${this.newW}px)`,
        'border-bottom': '0px',
        'background-size': `${this.newW}px 100%`,
      };
    },
  },
  created() {
    this.tableTh(0);
  },
  methods: {
    GanttView() {
      this.isToggleMenu = !this.isToggleMenu;
    },
    GanttViewId(index, name) {
      this.activeClass = index;
      this.viewText = name;
      this.generateYears(index)
      this.tableTh(index);
      this.isToggleMenu = false;
    },
    tableTh(id) {
      var dateRange = []
      if (id == 0) {
        //日试图的年月渲染
        for (let year = this.startDate; year <= this.endDate; year++) {
          for (var month = 0; month < 12; month++) {
            var lastDay = new Date(year, month + 1, 0).getDate();
            for (var day = 1; day <= lastDay; day++) {
              dateRange.push(new Date(year, month, day));
            }
            // 在 .tableYear 中添加年份和月份信息
            var yearMonthStr = year + "-" + (month + 1 < 10 ? "0" : "") + (month + 1);
            var width = (lastDay * 40) - 1 + "px"; // 计算宽度
            this.MothY.push({ name: yearMonthStr, width: width });
          }
        }
        //日试图的日渲染，标出周末以及当前日期深颜色
        for (var i = 0; i < dateRange.length; i++) {
          var currentDate = dateRange[i];
          var dayNumber = currentDate.getDay(); // 获取星期几 (0 = 星期日, 1 = 星期一, ...)
          //计算周末
          var isWeekend = dayNumber === 0 || dayNumber === 6;

          var dayText = currentDate.getDate();//获取日
          var dayYear = currentDate.getFullYear(); // 获取年份
          var dayMonth = currentDate.getMonth(); // 获取月份（注意：月份是从 0 到 11，0 表示一月，11 表示十二月）
          //获取当前日期进行匹配
          var isToday = dayText === this.today && dayYear === this.currentYear && dayMonth === this.currentMonth
          this.dayView.push({ name: currentDate.getDate(), bool: isWeekend, isToday: isToday });
        }
        //计算任务的宽度 开始时间的位置和结束时间的位置
        for (let j = 0; j < this.taskList.length; j++) {
          var ls = this.taskList[j];
          var offsetDays = this.getOffsetDays(ls.startDate, ls.dateClosed)
          var leftDays = this.getOffsetDays(ls.startDate, this.startDate + "-" + 1 + "-" + 1)
          //console.log(offsetDays)
          var offsetwidth = offsetDays * 40 + "px";
          var leftwidth = Math.abs(leftDays * 40) + "px";
          var tableNameintroWidth = Math.abs(leftDays * 40) + offsetDays * 40 + 40 + "px";
          //向数组中添加新字段
          ls.offsetwidth = offsetwidth;
          ls.leftwidth = leftwidth;
          ls.tableNameintroWidth = tableNameintroWidth;
        }
        this.$nextTick(() => {
          this.tableRectangle(this.activeClass); // 传入实际的 id 值
        });
      }
    },
    //计算任务开始日期和结束日期相差的天数
    getOffsetDays(startDate, endDate) {
      var startDateArr = startDate.split("-");
      var checkStartDate = new Date();
      checkStartDate.setFullYear(startDateArr[0], startDateArr[1] - 1, startDateArr[2]);
      var endDateArr = endDate.split("-");
      var checkEndDate = new Date();
      checkEndDate.setFullYear(endDateArr[0], endDateArr[1] - 1, endDateArr[2]);
      var days = (checkEndDate.getTime() - checkStartDate.getTime()) / (3600000 * 24);
      return days;
    },
    tableRectangle(id) {
      this.width = this.$refs.tableDay.offsetWidth;
      var todayElement = this.$refs.today;
      //将屏幕滚到视口位置
      if (todayElement.length > 0) {
        todayElement[0].scrollIntoView({ behavior: 'auto', block: 'center', inline: 'center' });
      }
      this.newW = (id == 0) ? 40 : 201;
    },
    //视图切换
    generateYears(id) {
      this.displayedYears = {};//清空记录显示的年份
      this.MothY1 = [];
      this.monthView = [];
      this.quarterView = [];
      this.yearView = [];
      for (var year = this.startDate; year <= this.endDate; year++) {
        var newLength = "";
        var newwidth = ""
        if (id == 1) {
          newLength = 12;
          newwidth = (12 * 201) - 1 + "px";
        } else if (id == 2) {
          newLength = 4;
          newwidth = (4 * 201) - 1 + "px";
        } else if (id == 3) {
          newLength = 2;
          newwidth = (2 * 201) - 1 + "px";
        }
        for (var quarterIndex = 0; quarterIndex < newLength; quarterIndex++) {
          var width = 200 + "px"; // 计算宽度

          if (!this.displayedYears[year]) {
            this.MothY1.push({ name: year, width: newwidth });
            this.displayedYears[year] = true; // 记录已显示的年份
          }
          if (id == 1) {
            var isToday = year === this.currentYear && (quarterIndex) === this.currentMonth;
            this.monthView.push({
              name: (quarterIndex + 1), width: width, isToday: isToday
            })

          } else if (id == 2) {

            var currentQuarter;
            if (this.currentMonth >= 1 && this.currentMonth <= 3) {
              currentQuarter = 1;
            } else if (this.currentMonth >= 4 && this.currentMonth <= 6) {
              currentQuarter = 2;
            } else if (this.currentMonth >= 7 && this.currentMonth <= 9) {
              currentQuarter = 3;
            } else {
              currentQuarter = 4;
            }
            isToday = year === this.currentYear && (quarterIndex + 1) === currentQuarter
            this.quarterView.push({
              name: this.quarters[quarterIndex], width: width, isToday: isToday
            })

          } else {
            if (this.currentMonth >= 1 && this.currentMonth <= 6) {
              currentQuarter = 1;
            } else {
              currentQuarter = 2;
            }
            isToday = year === this.currentYear && (quarterIndex + 1) === currentQuarter;

            this.yearView.push({
              name: this.Annuals[quarterIndex], width: width, isToday: isToday
            })
          }

        }
      }
      for (let j = 0; j < this.taskList.length; j++) {
        var ls = this.taskList[j];
        var offsetDays = this.getOffsetDays(ls.startDate, ls.dateClosed)
        var leftDays = this.getOffsetDays(ls.startDate, this.startDate + "-" + 1 + "-" + 1)

        //向数组中添加新字段
        if (id == 1) {
          ls.offsetwidth = (offsetDays * 200) / 30 + "px";
          ls.leftwidth = Math.abs(leftDays * 200) / 30 + "px";
          ls.tableNameintroWidth = Math.abs(leftDays * 200) / 30 + (offsetDays * 200) / 30 + 40 + "px";
        } else if (id == 2) {
          ls.offsetwidth = (offsetDays * 200) / 90 + "px";
          ls.leftwidth = Math.abs(leftDays * 200) / 90 + "px";
          ls.tableNameintroWidth = Math.abs(leftDays * 200) / 90 + (offsetDays * 200) / 90 + 40 + "px";
        } else if (id == 3) {
          ls.offsetwidth = (offsetDays * 200) / 180 + "px";
          ls.leftwidth = Math.abs(leftDays * 200) / 180 + "px";
          ls.tableNameintroWidth = Math.abs(leftDays * 200) / 180 + (offsetDays * 200) / 180 + 40 + "px";
        }

      }

      this.tableRectangle(id)
    },
    getActiveClassData() {
      switch (this.activeClass) {
        case 0:
          return this.dayView;
        case 1:
          return this.monthView;
        case 2:
          return this.quarterView;
        case 3:
          return this.yearView;
        default:
          return [];
      }
    },
    getMonthSuffix(item) {
      console.log(item)
      if (this.activeClass === 1) {
        return ' 月';
      }
      return '';
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.tableRectangle(this.activeClass);
    });
  },
  updated() {
    this.$nextTick(() => {
      this.tableRectangle(this.activeClass);
    })
  },
}
</script>

<style lang="scss" scoped>
@import url(./index.scss);
</style>