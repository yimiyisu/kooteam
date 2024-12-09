export default {
  url: "/do/select/project_template",
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'projects/template',
  title: "公共模板",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"title","label":"模板标题"},{"name":"todoGroup","label":"待办分组","type":"table"},{"name":"fileGroup","label":"附件分组","type":"table"},{"name":"knowledge","label":"启用知识库","type":"switch"},{"name":"uid","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"}],
  columns: ["title","uid","updateGmt"],
  condition: ["title"],
  slots: {
      header$() {
      return (
        <>
        <z-action label='新建模板' fields={["title",{"name":"todoGroup","slot":"todoSlot"},{"name":"fileGroup","slot":"fileSlot"},"knowledge"]} url='/do/put/project_template' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action label='编辑' fields={["title",{"name":"todoGroup","slot":"todoSlot"},{"name":"fileGroup","slot":"fileSlot"},"knowledge"]} from='/do/get/project_template' link data={row} url='/do/patch/project_template' includeTitle='r' />
<z-action label='删除' mode='confirm' link data={row} url='/do/delete/project_template' />
        </>
      )
    }
  }
}
  