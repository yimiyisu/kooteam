export default {
  url: "/do/select/oauth",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 90,
  path: 'system/oauth',
  title: "开放授权",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"domain","label":"应用域名"},{"name":"accessKey","label":"授权key","type":"textarea"},{"name":"secretKey","label":"密钥key","type":"textarea"}],
  columns: ["domain","accessKey","creator","updateGmt"],
  condition: ["domain"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='86fnb5ym' label='新建授权应用' fields={["domain"]} cb='rsync' type='primary' url='/api/system/createOAuth' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='3pxx0gls' label='删除' mode='confirm' cb='rsync' link data={row} url='/do/delete/oauth' />
        </>
      )
    }
  }
}
  