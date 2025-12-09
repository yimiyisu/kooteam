export default {
  url: "/do/select/evaluation",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'performance/evaluationMag',
  title: "评估管理",
	tabs: {"code":"planCycle","list":[],"keyword":"cycle"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"标题"},{"name":"desc","label":"描述","type":"textarea"},{"name":"status","label":"状态","code":"evaStatus"},{"name":"image","label":"图片","type":"image"},{"name":"cycle","label":"评估周期","code":"planCycle"},{"name":"uids","label":"被评估人","type":"users"},{"name":"score","label":"评估总分","type":"number"}],
  columns: ["title","desc","status","cycle","createGmt","updateGmt"],
  condition: ["title","status"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='h08jjeit' label='创建评估' mode='dialog' fields={["title","desc","image","cycle","uids"]} url='/do/put/evaluation' title='创建评估' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='kjr7sgav' label={row.status === 3?'结束':null} mode='confirm' link data={row} url='/do/patch/evaluation_end' />
<z-action p='2tzqv90r' label={row.status === 1?'发布':null} mode='confirm' link data={row} url='/do/patch/evaluation_push' />
<z-action p='s87n2w4z' label='题目' data={row} mode='drawer' href='/performance/question' link map={{"evaluationId":"id"}} />
<z-action p='fki30jec' label='维度' data={row} mode='drawer' href='/performance/dimension' link map={{"evaluationId":"id"}} />
<z-action p='762qwnra' label='编辑' mode='dialog' fields={["title","desc","image","cycle","uids"]} link data={row} url='/do/patch/evaluation' />
<z-action p='ps7wem8h' label='删除' mode='confirm' link data={row} url='/do/delete/evaluation' />
        </>
      )
    }
  }
}
  