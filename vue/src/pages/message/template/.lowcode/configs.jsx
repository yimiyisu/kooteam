export default {
  url: "/do/select/message_template",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'message/template',
  title: "消息模版",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"name","label":"模板名称"},{"name":"channels","label":"关联渠道","type":"inputTag"},{"name":"title","label":"模板标题"}],
  columns: ["name","title","createGmt","updateGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='hfco5yf4' label='新建模版' mode='dialog' fields={["name","title","channels"]} type='primary' url='/do/put/message_template' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='s4t0y4sl' label='编辑' mode='dialog' fields={["name","title","channels"]} link data={row} url='/do/patch/message_template' />
<z-action p='7snkjq38' label='消息发送' mode='dialog' fields={[{"name":"id","slot":"messageSend"}]} link data={row} url='/api/system/checkMessage' />
<z-action p='pgb16ijf' label='删除' mode='confirm' link data={row} url='/do/delete/message_template' />
        </>
      )
    }
  }
}
  