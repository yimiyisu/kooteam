export default {
  url: "/do/select/week_group",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'report/group',
  title: "分组管理",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"title","label":"分组名称"},{"name":"content","label":"分组用户","type":"inputTag"},{"name":"uid","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"}],
  columns: ["title","createGmt","updateGmt"],
  condition: ["title"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='52eimkgi' label='新建分组' fields={["title",{"name":"content","slot":"userSlot"}]} type='primary' url='/do/put/week_group' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='ofijdzf6' label='编辑' fields={["title",{"name":"content","slot":"userSlot"}]} link data={row} url='/do/patch/week_group' includeTitle='r' />
<z-action p='dx7rvrnt' label='删除' mode='confirm' link data={row} url='/do/delete/week_group' />
        </>
      )
    }
  }
}
  