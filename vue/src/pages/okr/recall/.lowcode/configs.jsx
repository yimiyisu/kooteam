export default {
  url: "/do/select/review_my",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: '/okr//recall',
  title: "我的复盘",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"标题"},{"name":"content","label":"内容","type":"tiptap"},{"name":"range","label":"可见范围","code":"visibleRange"},{"name":"file","label":"附件","type":"attach"},{"name":"targetId","label":"复盘目标","type":"search","depend":"goal"}],
  columns: ["title","range","targetId","createGmt"],
  condition: ["title","range"],
  slots: {
    action$({ row }) {
      return (
        <>
          <z-action p='ri7s3prg' label='编辑' mode='dialog' width='800px' fields={["title","content","file"]} link data={row} url='/do/patch/review' />
<z-action p='3008hmlh' label='删除' mode='confirm' link data={row} url='/do/delete/review' />
        </>
      )
    }
  }
}
  