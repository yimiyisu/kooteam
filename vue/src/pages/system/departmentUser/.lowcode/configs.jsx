export default {
  url: "/do/join/employee",
  conditionLimit:null,
  selectable: false,
  showIndex: true,
  compact: 220,
  path: 'system/departmentUser',
  title: "部门员工",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"realname","label":"真实姓名"},{"name":"mobile","label":"联系电话"},{"name":"email","label":"邮箱"},{"name":"english","label":"英文名"}],
  columns: ["id","realname","mobile","updateGmt"],
  condition: [],
  slots: {
    action$({ row }) {
      return (
        <>
          <z-action p='zp9exbje' label='删除' mode='confirm' link data={row} url='/do/delete/department_user' />
        </>
      )
    }
  }
}
  