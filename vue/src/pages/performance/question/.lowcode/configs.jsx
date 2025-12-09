export default {
  url: "/do/select/question",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'performance/question',
  title: "题目",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"标题","type":"textarea"},{"name":"type","label":"类型","code":"questionType"},{"name":"options","label":"选项","type":"question"},{"name":"require","label":"是否必填","type":"switch"},{"name":"evaluationId","label":"评估ID","type":"search","depend":"evaluation"},{"name":"order","label":"排序"},{"name":"score","label":"题目分数","type":"number"}],
  columns: ["title","type","require"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='i9pfmank' label='添加' mode='dialog' fields={["title","type","options","require"]} url='/api/evaluation/putQuestion' title='添加' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='lg6kik2e' label='编辑' mode='dialog' fields={["title","options","require"]} link data={row} url='/api/evaluation/patchQuestion' />
<z-action p='6ye51928' label='删除' mode='confirm' link data={row} url='/api/evaluation/deleteQuestion' />
        </>
      )
    }
  }
}
  