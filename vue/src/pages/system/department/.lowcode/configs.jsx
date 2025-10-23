export default {
  url: "/do/list/department",
  conditionLimit:null,
  selectable: true,
  showIndex: true,
  compact: 220,
  path: 'system/department',
  title: "部门管理",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"title","label":"部门名称"},{"name":"titleEn","label":"英文名称"},{"name":"leaders","label":"部门负责人","type":"inputTag"},{"name":"parentId","label":"父级部门","type":"search","depend":"department"},{"name":"order","label":"排序","type":"number"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"isLeaf","label":"是否为子部门","type":"switch"},{"name":"outId","label":"部门id"}],
  columns: ["title","titleEn","leaders","parentId","order","createGmt","isLeaf"],
  condition: ["title"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='dn69ulax' label='新增部门' mode='dialog' fields={["title","titleEn","parentId","order","isLeaf"]} type='primary' url='/do/put/department' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='zaufnblr' label='删除' mode='confirm' link data={row} url='/do/delete/department' />
<z-action p='9e91n2f2' label='修改' mode='dialog' fields={["title","titleEn","leaders","parentId","order","isLeaf"]} link data={row} url='/do/patch/department' />
        </>
      )
    }
  }
}
  