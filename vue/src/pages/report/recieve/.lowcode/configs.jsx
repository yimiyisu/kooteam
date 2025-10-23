export default {
  url: "/do/select/week_recieve",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'report/recieve',
  title: "我收到的",
	tabs: {"list":[{"label":"已阅","value":"1","id":"9jtlzn4h"},{"label":"未阅","value":"0","id":"lun83je7"}],"keyword":"status"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"weekId","label":"周报标题"},{"name":"uid","label":"接收人","type":"user"},{"name":"sendUid","label":"发送人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"status","label":"是否已阅","type":"switch"}],
  columns: ["weekId","sendUid","status","createGmt","updateGmt"],
  condition: ["weekId","sendUid"],
  slots: {
    
  }
}
  