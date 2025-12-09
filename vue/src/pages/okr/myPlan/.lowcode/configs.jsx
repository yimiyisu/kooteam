export default {
  url: "/do/select/plan_user",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'okr/myPlan',
  title: "我的规划",
	tabs: {"code":"planCycle","list":[],"keyword":"cycle"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"uid","label":"用户id","type":"user"},{"name":"planId","label":"规划id","type":"search","depend":"plan"},{"name":"title","label":"标题"},{"name":"description","label":"描述","type":"textarea"},{"name":"startGmt","label":"开始时间","type":"date"},{"name":"endGmt","label":"结束时间","type":"date"},{"name":"cycle","label":"周期","code":"planCycle"},{"name":"stage","label":"当前阶段","code":"planStage"},{"name":"score","label":"评分","type":"number"},{"name":"charge","label":"负责人","type":"user"}],
  columns: ["title","description","startGmt","endGmt","cycle","charge","stage"],
  condition: [],
  slots: {
    
  }
}
  