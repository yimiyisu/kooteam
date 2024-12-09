export default {
  url: "/do/select/myArchive",
  compact: 220,
  path: 'projects/archive',
  title: "归档的任务",
  entitys: [{"name":"id","label":"编号"},{"name":"title","label":"待办标题"},{"name":"content","label":"详情内容","type":"textarea"},{"name":"parentId","label":"父级ID","type":"search"},{"name":"projectId","label":"工程ID","type":"search"},{"name":"uid","label":"创建人","type":"user"},{"name":"owner","label":"负责人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"status","label":"状态","code":"thingStatus"},{"name":"quadrant","label":"优先级","code":"quadrantType"}],
  columns: ["title","owner","quadrant","uid","status","createGmt"],
  condition: ["title","owner","uid","quadrant","status"],
  slots: {
    action$({ row }) {
      return (
        <>
          <z-action label='取消归档' mode='confirm' link data={row} url='/api/archive/restore' />
<z-action label='删除' mode='confirm' link data={row} url='/do/delete/thing_archive' />
        </>
      )
    }
  }
}
  