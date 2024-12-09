export default {
  url: "/do/select/site",
  compact: 220,
  path: 'task/watch',
  title: "关注的任务",
  entitys: [{"name":"id","label":"编号"},{"name":"title","label":"代办标题"},{"name":"content","label":"详细内容","type":"textarea"},{"name":"parentId","label":"父级代办","type":"search","depend":"thing"},{"name":"projectId","label":"所属工程","type":"search","depend":"project"},{"name":"order","label":"排序","type":"number"},{"name":"start","label":"计划开始时间","type":"date"},{"name":"end","label":"计划结束时间","type":"date"},{"name":"createUid","label":"创建人","type":"user"},{"name":"owner","label":"负责人","type":"user"},{"name":"quadrant","label":"紧急象限","code":"quadrantType"},{"name":"status","label":"是否完成","code":"thingStatus"},{"name":"tag","label":"任务标签","type":"number"},{"name":"remind","label":"提醒配置","type":"json"},{"name":"plan","label":"计划类型","code":"pageStatus"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"step","label":"所属阶段"}],
  columns: ["title","id","owner","quadrant","status","createGmt"],
  condition: ["title","owner","quadrant"],
  slots: {
    action$({ row }) {
      return (
        <>
          <z-action label='取消关注' mode='confirm' link data={row} />
        </>
      )
    }
  }
}
  