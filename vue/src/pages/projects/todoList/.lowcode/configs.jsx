export default {
  url: "/do/select/thingForProject",
  conditionLimit:3,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'projects/todoList',
  title: "全部任务",
	tabs: {"code":"thingStatus","list":[],"keyword":"status"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"title","label":"待办标题"},{"name":"content","label":"详细内容","type":"textarea"},{"name":"parentId","label":"父级待办","type":"search","depend":"thing"},{"name":"projectId","label":"所属工程","type":"search","depend":"project"},{"name":"order","label":"排序"},{"name":"start","label":"计划开始时间","type":"date"},{"name":"end","label":"计划结束时间","type":"date"},{"name":"createUid","label":"创建人","type":"user"},{"name":"owner","label":"负责人","type":"user"},{"name":"quadrant","label":"优先级","code":"quadrantType"},{"name":"status","label":"是否完成","code":"thingStatus"},{"name":"tag","label":"任务标签","type":"number"},{"name":"remind","label":"提醒配置","type":"json"},{"name":"plan","label":"计划类型","code":"pageStatus"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"step","label":"所属阶段"},{"name":"watchers","label":"关注人","type":"table"},{"name":"notes","label":"关联的知识库","type":"table"}],
  columns: ["title","owner","quadrant","status","updateGmt"],
  condition: ["title","owner","quadrant","createUid"],
  slots: {
      header$() {
      return (
        <>
        <z-fileport label='导出任务' mode='export' fields={["id","title","quadrant","createGmt"]} type='primary' />
        </>
      )
    },
    
  }
}
  