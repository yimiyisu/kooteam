export default {
  url: "/do/select/dimension",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'performance/dimension',
  title: "维度",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"evaluationId","label":"评估id","type":"search","depend":"evaluation"},{"name":"type","label":"维度类型","code":"dimension"},{"name":"weight","label":"维度权重","type":"number"},{"name":"questions","label":"关联题目","type":"inputTag"},{"name":"score","label":"维度满分","type":"number"},{"name":"num","label":"题目数量","type":"number"}],
  columns: ["type","weight","score","num"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='ihc6acgf' label='添加维度' mode='dialog' fields={["type","weight"]} url='/do/put/dimension' title='添加维度' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='4ajhjo5j' label='删除' mode='confirm' link data={row} url='/do/delete/dimension' />
        </>
      )
    }
  }
}
  