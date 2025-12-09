export default {
  url: "/do/select/ai_week",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'report/aiReport',
  title: "AI周报",
	tabs: {"code":"aiWeekType","list":[],"keyword":"type"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"标题"},{"name":"content","label":"内容","type":"textarea"},{"name":"type","label":"类型","code":"aiWeekType"},{"name":"group","label":"组别","type":"search","depend":"week_group"},{"name":"recivers","label":"接收人","type":"inputTag"},{"name":"groups","label":"接收组","type":"inputTag"},{"name":"status","label":"状态","code":"aiWeekStatus"},{"name":"isSend","label":"是否发送","code":"weekStatus"},{"name":"reason","label":"失败原因","type":"textarea"},{"name":"startGmt","label":"开始时间","type":"date"},{"name":"endGmt","label":"结束时间","type":"date"}],
  columns: ["title","content","type","status","isSend","creator","createGmt"],
  condition: ["title","status"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='eak9gs29' label='创建周报' mode='dialog' fields={["title",{"name":"recivers","slot":"recieversSlot"},{"name":"groups","slot":"groupSlot"},"type","group","startGmt","endGmt"]} url='/api/weekReport/createAIReport' title='创建周报' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='qxocouuv' label={row.status === 3 && row.isSend === 1?'发送':null} mode='confirm' link data={row} url='/api/weekReport/sendAIReport' />
<z-action p='5l6aufwe' label='详情' data={row} mode='drawer' href='/report/detail' link map={{"id":"id"}} includeTitle='l' />
<z-action p='l86d1jiv' label='删除' mode='confirm' link data={row} url='/do/delete/ai_week' />
<z-action p='ropcrfng' label='改状态' mode='dialog' fields={["isSend"]} link data={row} url='/do/patch/ai_week' />
        </>
      )
    }
  }
}
  