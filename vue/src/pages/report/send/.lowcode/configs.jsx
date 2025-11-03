export default {
  url: "/do/select/week",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'report/send',
  title: "我发出的",
	tabs: {"list":[{"label":"已发送","value":"1","id":"skezsl3n"},{"label":"未发送","value":"0","id":"a9aqyk7o"}],"keyword":"status"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"title","label":"周报标题"},{"name":"recievers","label":"接收人","type":"inputTag"},{"name":"groups","label":"接受的组","type":"inputTag"},{"name":"uid","label":"创建人","type":"user"},{"name":"content","label":"日报内容","type":"tiptap"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"status","label":"是否已发送","code":"weekStatus"},{"name":"timer","label":"定时发送时间","type":"date"},{"name":"summary","label":"总结与思考","type":"textarea"}],
  columns: ["title","status","createGmt","updateGmt"],
  condition: ["title"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='fq8u20tc' label='新建周报' width='900px' fields={["title",{"name":"recievers","slot":"recieversSlot"},{"name":"groups","slot":"groupSlot"},"summary",{"name":"content","slot":"editorSlot"},"timer"]} br='beforeSubmit' type='primary' url='/do/put/week' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='zysimi3p' label={row.status===1?'发送':null} mode='confirm' link data={row} url='/api/weekReport/send' />
<z-action p='qw0oc96f' label={row.status===1?'编辑':null} width='900px' fields={["title",{"name":"recievers","slot":"recieversSlot"},{"name":"groups","slot":"groupSlot"},"summary",{"name":"content","slot":"editorSlot"},"timer"]} link data={row} url='/do/patch/week' includeTitle='r' />
<z-action p='qfym3te5' label='查看' data={row} mode='drawer' href='/report/detail' fixed='report' link map={{"id":"id"}} />
<z-action p='wvdltrh6' label='删除' mode='confirm' link data={row} url='/do/delete/week' />
        </>
      )
    }
  }
}
  