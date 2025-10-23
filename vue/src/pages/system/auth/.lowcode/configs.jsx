export default {
  url: "/do/select/wx_auth",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'system/auth',
  title: "服务号授权",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"appTitle","label":"应用名"},{"name":"appName","label":"应用标识"},{"name":"domain","label":"回调地址"},{"name":"appid","label":"服务号","type":"search","depend":"mp"}],
  columns: ["appTitle","appName","appid","domain","createGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='n2t4ath7' label='添加' mode='dialog' fields={["appTitle","appName","domain","appid"]} type='primary' url='/do/put/wx_auth' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='yxp6fw7d' label='授权链接' fields={[{"name":"appName","slot":"authLink"}]} link data={row} />
<z-action p='h9uhbmkx' label='编辑' mode='dialog' fields={["appTitle","appName","domain","appid"]} link data={row} url='/do/patch/wx_auth' />
<z-action p='k0hhk17l' label='删除' mode='confirm' link data={row} url='/do/delete/wx_auth' />
        </>
      )
    }
  }
}
  