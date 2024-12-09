export default {
  url: "/do/select/week",
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'report/send',
  title: "我发出的",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"title","label":"周报标题"},{"name":"recievers","label":"接收人","type":"table"},{"name":"groups","label":"接受的组","type":"table"},{"name":"uid","label":"创建人","type":"user"},{"name":"content","label":"日报内容","type":"editor"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"status","label":"是否已发送","type":"switch"},{"name":"timer","label":"定时发送时间","type":"date"},{"name":"summary","label":"总结与思考","type":"textarea"}],
  columns: ["title","status","createGmt","updateGmt"],
  condition: ["title","status"],
  slots: {
      header$() {
      return (
        <>
        <z-action label='新建周报' width='860px' fields={["title",{"name":"recievers","slot":"recieversSlot"},{"name":"groups","slot":"groupSlot"},"summary",{"name":"content","slot":"editorSlot"},"timer"]} url='/do/put/week' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action label={row.status===0?'发送':null} mode='confirm' link data={row} url='/do/patch/weekSend' />
<z-action label={row.status===0?'编辑':null} width='860px' fields={["title",{"name":"recievers","slot":"recieversSlot"},{"name":"groups","slot":"groupSlot"},"summary",{"name":"content","slot":"editorSlot"},"timer"]} from='/do/get/weekByOwner' link data={row} url='/do/patch/week' includeTitle='r' />
<z-action label='查看' data={row} mode='drawer' href='/report/detail' fixed='report' fields={["title",{"name":"recievers","slot":"recieversSlot"},{"name":"groups","slot":"groupSlot"},"content"]} link map={{"id":"id"}} />
<z-action label={row.status===0?'删除':null} mode='confirm' link data={row} url='/do/delete/week' />
        </>
      )
    }
  }
}
  