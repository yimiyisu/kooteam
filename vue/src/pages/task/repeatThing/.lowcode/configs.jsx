export default {
  url: "/do/select/repeat_thing",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'task/repeatThing',
  title: "重复任务",
	tabs: {"code":"thingRepeat","list":[],"keyword":"type"},
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"标题"},{"name":"content","label":"详细内容","type":"textarea"},{"name":"file","label":"附件","type":"attach"},{"name":"owner","label":"负责人","type":"user"},{"name":"type","label":"重复类型","code":"thingRepeat"},{"name":"quadrant","label":"优先级","code":"quadrantType"},{"name":"isOpen","label":"是否开启","type":"switch"}],
  columns: ["title","quadrant","type","owner","creator","createGmt","isOpen"],
  condition: ["title","quadrant","owner"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='2rmuhu8e' label='创建重复任务' mode='dialog' fields={["title","content","file","owner","type","quadrant"]} url='/do/put/repeat_thing' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='m8r04t6i' label='修改' mode='dialog' fields={["title","content","file","owner"]} link data={row} url='/do/patch/repeat_thing' />
<z-action p='bcbfr1go' label='详情' mode='dialog' fields={["title","content","file","owner","type","quadrant","creator","createGmt","updateGmt"]} from='/do/get/repeat_thing' link data={row} />
<z-action p='1w88cum5' label={row.isOpen === 0?'开启':null} mode='confirm' link data={row} url='/do/patch/repeat_thing_open' />
<z-action p='dqhdis58' label={row.isOpen === 1?'关闭':null} mode='confirm' link data={row} url='/do/patch/repeat_thing_close' />
<z-action p='99dbfrmq' label={row.isOpen === 0?'删除':null} mode='confirm' link data={row} url='/do/delete/repeat_thing' />
        </>
      )
    }
  }
}
  