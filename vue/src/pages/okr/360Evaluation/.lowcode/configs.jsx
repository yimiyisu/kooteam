export default {
  url: "/do/select/evaluation",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'okr/360Evaluation',
  title: "360评估",
	tabs: {"code":"planCycle","list":[],"keyword":"cycle"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"标题"},{"name":"desc","label":"描述","type":"textarea"},{"name":"status","label":"状态","code":"evaStatus"},{"name":"image","label":"图片","type":"image"},{"name":"cycle","label":"评估周期","code":"planCycle"},{"name":"uids","label":"被评估人","type":"inputTag"}],
  columns: ["title","status","desc","cycle","creator","createGmt"],
  condition: ["title","status"],
  slots: {
    
  }
}
  