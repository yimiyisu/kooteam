export default {
  url: "/do/select/goal_owner",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: '/okr//my',
  title: "我的目标",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"标题"},{"name":"description","label":"描述","type":"textarea"},{"name":"type","label":"类型","code":"goalType"},{"name":"parentId","label":"父id","type":"search","depend":"goal"},{"name":"owner","label":"负责人","type":"user"},{"name":"cycle","label":"周期","code":"planCycle"},{"name":"currentValue","label":"当前完成值","type":"number"},{"name":"targetValue","label":"目标值","type":"number"},{"name":"unit","label":"单位","code":"goalUnit"},{"name":"process","label":"完成进度","type":"number"},{"name":"weight","label":"权重","type":"number"},{"name":"status","label":"状态","code":"goalStatus"},{"name":"planId","label":"规划","type":"search","depend":"plan"},{"name":"startGmt","label":"开始时间","type":"date"},{"name":"endGmt","label":"结束时间","type":"date"},{"name":"watchers","label":"关注人","type":"inputTag"},{"name":"aligns","label":"目标对齐","type":"inputTag"},{"name":"range","label":"可见范围","code":"visibleRange"},{"name":"isTemplate","label":"是否为模版","type":"switch"}],
  columns: ["title","description","owner","process","cycle","status","planId","endGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='qfim1i5s' label='创建目标' mode='dialog' fields={["title","owner","type","startGmt","endGmt","range"]} url='/do/put/goal_parent' title='创建目标' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='s8cg0rki' label='详情' data={row} mode='drawer' href='/performance/krs' link map={{"parentId":"id","planId":"planId"}} />
        </>
      )
    }
  }
}
  