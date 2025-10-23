export default {
  url: "/do/select/role_user",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'system/roleUser',
  title: "角色用户",
  entitys: [{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"uid","label":"用户ID","type":"user"},{"name":"roleId","label":"角色","type":"search","depend":"role"},{"name":"id","label":"编号","type":"search"}],
  columns: ["uid","roleId","createGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='vyv4ohs0acl' label='添加用户' mode='dialog' fields={["uid"]} cb='refresh' type='primary' url='/do/put/role_user' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='29a6t3pdkc1' label='刷新权限' mode='confirm' link data={row} url='/api/user/refresh' />
<z-action p='kn233cy93jb' label='删除' mode='confirm' cb='refresh' link data={row} url='/do/delete/role_user' />
        </>
      )
    }
  }
}
  