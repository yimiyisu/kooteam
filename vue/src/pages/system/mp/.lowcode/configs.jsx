export default {
  url: "/do/select/mp",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'system/mp',
  title: "服务号管理",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"名称"},{"name":"appId","label":"服务号"},{"name":"appSecret","label":"服务号密钥"},{"name":"image","label":"服务号二维码","type":"image"}],
  columns: ["title","appId","image","createGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='p54v1fo1' label='添加' mode='dialog' fields={["title","appId","appSecret","image"]} type='primary' url='/do/put/mp' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='ocrgl326' label='编辑' mode='dialog' fields={["title","appId","appSecret","image"]} link data={row} url='/do/patch/mp' includeTitle='r' />
<z-action p='3dz772b7' label='删除' mode='confirm' link data={row} url='/do/delete/mp' />
        </>
      )
    }
  }
}
  