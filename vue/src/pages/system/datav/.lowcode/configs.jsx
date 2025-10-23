export default {
  url: "/do/select/datav",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'system/datav',
  title: "数据大屏模板",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"标题"},{"name":"config","label":"配置信息","type":"map"},{"name":"data","label":"配置信息","type":"map"}],
  columns: ["id","title","creator","createGmt","updateGmt"],
  condition: ["title","creator"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='crdg6h9d' label='创建大屏' fields={["title"]} type='primary' url='/do/put/datav' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='hi1w25ka' label='大屏设计' data={row} mode='drawer' href='/system/datavDesinger' fixed='datav' width='90%' link map={{"id":"id"}} />
<z-action p='4ftbn7fu' label='编辑' fields={["title"]} link data={row} url='/do/patch/datav' includeTitle='r' />
<z-action p='h8btzfy1' label='删除' mode='confirm' link data={row} url='/do/delete/datav' />
        </>
      )
    }
  }
}
  