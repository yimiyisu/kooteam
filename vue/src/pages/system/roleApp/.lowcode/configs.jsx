export default {
  url: "/do/list/role_app",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'system/roleApp',
  title: "权限配置",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"roleId","label":"角色ID","type":"search","depend":"role"},{"name":"app","label":"应用名"},{"name":"permissions","label":"权限配置","type":"inputTag"},{"name":"points","label":"页面权限点","type":"json"}],
  columns: ["roleId","app"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='12wp6pr0th4' label='配置权限' mode='dialog' fields={["roleId","app"]} type='primary' url='/do/put/role_app' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='mcv0iqry0i4' label='删除' mode='confirm' link data={row} url='/do/delete/role_app' />
<z-action p='adshc3ss7xv' label='修改' mode='dialog' fields={["app"]} link data={row} url='/do/patch/role_app' />
        </>
      )
    }
  }
}
  