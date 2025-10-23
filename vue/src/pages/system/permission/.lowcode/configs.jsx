export default {
  url: "/do/select/permission",
  conditionLimit:null,
  selectable: true,
  showIndex: true,
  compact: 220,
  path: 'system/permission',
  title: "权限管理",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"appKey","label":"应用名称"},{"name":"action","label":"操作权限标识符"},{"name":"desc","label":"描述"}],
  columns: ["action","desc","appKey"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action label='添加权限' mode='dialog' fields={["appKey","action","desc"]} type='primary' url='/do/put/permission' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action label='删除' mode='confirm' link data={row} url='/do/delete/permission' />
        </>
      )
    }
  }
}
  