export default {
  url: "/do/select/plan_white",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'performance/planWhite',
  title: "白名单",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"分组名称"},{"name":"desc","label":"备注","type":"textarea"}],
  columns: ["title","desc","creator","createGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='owy1uj6j' label='新增名单' mode='dialog' fields={["title","desc"]} url='/do/put/plan_white' title='新增名单' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='810pxozs' label='管理人员' data={row} mode='drawer' href='/performance/whiteUser' link map={{"whiteId":"id"}} includeTitle='l' />
<z-action p='szoi7z7j' label='删除' mode='confirm' link data={row} url='/do/delete/plan_white' />
        </>
      )
    }
  }
}
  