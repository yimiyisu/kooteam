export default {
  url: "/do/select/project_user",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'projects/member',
  title: "项目成员",
  entitys: [{"name":"id","label":"编号"},{"name":"userId","label":"用户ID","type":"user"},{"name":"projectId","label":"工程ID","type":"search","depend":"project"},{"name":"role","label":"用户角色","code":"projectRole"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"tag","label":"是否加星","type":"switch"},{"name":"templateId","label":"工程模板","type":"search","depend":"project_template"}],
  columns: ["userId","role","updateGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='9qynvx0vuk0' label='添加成员' mode='dialog' fields={["userId","role"]} type='primary' url='/do/put/project_user' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='ak6ppf4qwqn' label='删除' mode='confirm' link data={row} url='/do/delete/project_user' />
        </>
      )
    }
  }
}
  