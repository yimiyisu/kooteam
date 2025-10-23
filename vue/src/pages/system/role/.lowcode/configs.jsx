export default {
  url: "/do/select/role",
  conditionLimit:null,
  selectable: false,
  showIndex: true,
  compact: 280,
  path: 'system/role',
  title: "角色管理",
	tabs: {"list":[{"label":"启用","value":"1","id":"s8zgfaeotdd"},{"label":"禁用","value":"0","id":"oigyxjmcyw3"}],"keyword":"status"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"角色"},{"name":"status","label":"启用","type":"switch"},{"name":"desc","label":"描述"},{"name":"tenantId","label":"租户ID","type":"search"},{"name":"app","label":"应用名称"}],
  columns: ["title","status","desc"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='57nsi6wgwfn' label='添加角色' mode='dialog' fields={["title","desc"]} type='primary' url='/do/put/role' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='8hwr3nm2vf2' label='编辑' mode='dialog' fields={["title","status","desc"]} link data={row} url='/do/patch/role' />
<z-action p='56qyprfkt89' label='配置权限' data={row} mode='drawer' href='/system/roleApp' fixed='roleId' link map={{"roleId":"id"}} />
<z-action p='mriyrm3t6mm' label='关联用户' data={row} mode='drawer' href='/system/roleUser' fixed='user' link map={{"roleId":"id"}} includeTitle='l' />
<z-action p='jkgls6prn2n' label='删除' mode='confirm' link data={row} url='/do/delete/role' />
        </>
      )
    }
  }
}
  