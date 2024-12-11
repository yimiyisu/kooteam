export default {
  url: "/do/select/flow_template",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'note/flowTemplate',
  title: "流程图模版",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"title","label":"模板名称"},{"name":"groupId","label":"分组","type":"search","depend":"flow_group"},{"name":"preview","label":"预览图","type":"image"},{"name":"content","label":"模板内容","type":"textarea"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"}],
  columns: ["id","title","groupId","updateGmt"],
  condition: ["title","groupId"],
  slots: {
      header$() {
      return (
        <>
        <z-action label='新建模版' fields={["title","groupId","preview"]} type='primary' url='/do/put/flow_template' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action label='编辑' fields={["title","groupId","preview","content"]} from='/do/get/flow_template' link data={row} url='/do/patch/flow_template' includeTitle='r' />
<z-action label='删除' mode='confirm' link data={row} url='/do/delete/flow_template' />
        </>
      )
    }
  }
}
  