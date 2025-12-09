export default {
  url: "/do/select/white_emp",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'performance/whiteUser',
  title: "白名单人员",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"empId","label":"名称","type":"search","depend":"employee"},{"name":"whiteId","label":"分组","type":"search","depend":"plan_white"}],
  columns: ["empId","creator","createGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='13b2imjh' label='添加人员' mode='dialog' fields={["empId"]} url='/do/put/white_emp' title='添加人员' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='t0qpyaqd' label='删除' mode='confirm' link data={row} url='/do/delete/white_emp' />
        </>
      )
    }
  }
}
  