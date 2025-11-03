export default {
  url: "/do/select/oauth",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 160,
  path: 'system/oauth',
  title: "开放授权",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"domain","label":"域名/IP地址"},{"name":"accessId","label":"accessId","type":"textarea"},{"name":"secretKey","label":"secretKey","type":"textarea"},{"name":"title","label":"描述"}],
  columns: ["domain","title","creator","updateGmt"],
  condition: ["domain"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='86fnb5ym' label='新建授权应用' fields={["domain","title"]} cb='rsync' type='primary' url='/api/system/createOAuth' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='y8o0lldu' label='授权码' fields={["accessId","secretKey"]} link data={row} includeTitle='l' />
<z-action p='rl5kkzym' label='编辑' fields={["domain","title"]} cb='rsync' link data={row} url='/do/patch/oauth' includeTitle='r' />
<z-action p='3pxx0gls' label='删除' mode='confirm' cb='rsync' link data={row} url='/do/delete/oauth' />
        </>
      )
    }
  }
}
  