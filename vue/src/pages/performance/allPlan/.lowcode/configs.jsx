export default {
  url: "/do/select/plan",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'performance/allPlan',
  title: "所有规划",
	tabs: {"code":"planCycle","list":[],"keyword":"cycle"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"specify","label":"指定部门","type":"depSelect"},{"name":"white","label":"白名单","type":"search","depend":"plan_white"},{"name":"title","label":"标题"},{"name":"description","label":"描述","type":"textarea"},{"name":"startGmt","label":"开始时间","type":"date"},{"name":"endGmt","label":"结束时间","type":"date"},{"name":"cycle","label":"周期","code":"planCycle"},{"name":"status","label":"状态","code":"planStatus"},{"name":"isSend","label":"是否发送","type":"switch"},{"name":"charge","label":"负责人","type":"user"}],
  columns: ["title","startGmt","endGmt","creator","charge","white","cycle","status"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='0zrvhfm6' label='新建规划' mode='dialog' fields={["title","description","specify","white","startGmt","endGmt","cycle","charge"]} br='submit' url='/do/put/plan' title='新建规划' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='60rupqp3' label={row.isSend === 0?'发起考核':null} mode='confirm' link data={row} url='/api/plan/sendNotice' />
<z-action p='pm0olz0h' label={row.isSend === 0?'编辑':null} mode='dialog' fields={["title","description","startGmt","endGmt","charge","specify","white","cycle"]} link data={row} url='/do/patch/plan' includeTitle='l' />
<z-action p='jvwtd9pi' label='删除' mode='confirm' link data={row} url='/do/delete/plan' />
        </>
      )
    }
  }
}
  