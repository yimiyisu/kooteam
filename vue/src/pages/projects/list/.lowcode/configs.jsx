export default {
  url: "/do/join/myProject",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'projects/list',
  title: "项目列表",
	tabs: {"list":[{"label":"收藏的项目","value":"1","id":"xp8tnbv49mw"}],"keyword":"tag"},
  entitys: [{"name":"id","label":"编号"},{"name":"title","label":"标题"},{"name":"uid","label":"创建人","type":"user"},{"name":"todoGroup","label":"任务分组","type":"table"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"state","label":"统计信息","type":"json"},{"name":"fileGroup","label":"文件分组","type":"table"},{"name":"knowledge","label":"开启知识库","type":"switch"},{"name":"templateId","label":"项目模板","type":"search","depend":"project_template"},{"name":"groupId","label":"所属分组","type":"search","depend":"project_group"}],
  columns: [],
  condition: ["title","templateId"],
  slots: {
      header$() {
      return (
        <>
        <z-action label='新增项目' fields={["title","templateId"]} url='/do/put/project' />
        </>
      )
    },
    
  }
}
  