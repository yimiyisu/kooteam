export default {
  url: "/do/join/employee",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'system/employee',
  title: "员工管理",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"姓名"},{"name":"mobile","label":"联系电话"},{"name":"email","label":"邮箱"},{"name":"english","label":"英文名"}],
  columns: ["id","title","english","updateGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='s8qajfm4' label='测试' mode='confirm' type='success' url='/api/home/test' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='lo540yi9' label='删除' mode='confirm' link data={row} url='/do/delete/employee' />
        </>
      )
    }
  }
}
  