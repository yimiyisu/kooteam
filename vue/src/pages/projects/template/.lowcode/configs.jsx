export default {
  url: "/do/select/project_template",
  conditionLimit:null,
  selectable: true,
  showIndex: false,
  compact: 220,
  path: 'projects/template',
  title: "公共模板",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"title","label":"模板标题"},{"name":"todoGroup","label":"待办分组","type":"inputTag"},{"name":"fileGroup","label":"附件分组","type":"inputTag"},{"name":"knowledge","label":"启用知识库","type":"switch"},{"name":"uid","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"}],
  columns: ["title","uid","knowledge","createGmt","updateGmt"],
  condition: ["title"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='kwclnd2a5k5' label='新建模板' fields={["title",{"name":"todoGroup","slot":"todoSlot"},{"name":"fileGroup","slot":"fileSlot"},"knowledge"]} type='primary' url='/do/put/project_template' />
<z-action p='cltxpbog' label='删除' mode='confirm' sd={true} type='danger' url='/do/delete/project_template' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='ss7hk1mgw08' label='编辑' fields={["title",{"name":"todoGroup","slot":"todoSlot"},{"name":"fileGroup","slot":"fileSlot"},"knowledge"]} from='/do/get/project_template' link data={row} url='/do/patch/project_template' includeTitle='r' />
<z-action p='hsduouz05tz' label='删除' mode='confirm' link data={row} url='/do/delete/project_template' />
        </>
      )
    }
  }
}
  