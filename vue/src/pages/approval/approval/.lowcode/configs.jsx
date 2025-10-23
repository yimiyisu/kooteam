export default {
  url: "/do/select/approval",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'approval/approval',
  title: "审批流程",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"审批名称"},{"name":"groupId","label":"审批类型","type":"search","depend":"approval_group"},{"name":"groupName","label":"审批应用名"},{"name":"current","label":"当前审批节点","type":"search","depend":"approval_node"}],
  columns: ["title","groupId","groupName","current"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='qou6u2yjyt9' label='创建审批流' mode='dialog' fields={["title","groupId",{"name":"groupName","slot":"AppSelect"}]} type='primary' url='/do/put/approval' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='c2cb064wbog' label='编辑' mode='dialog' fields={["title","groupId","groupName","current"]} link data={row} url='/do/patch/approval' />
<z-action p='yw15obaeaef' label='节点' data={row} mode='drawer' href='/approval/node' fixed='approvalId' link map={{"approvalId":"id"}} />
<z-action p='3pishmsi18f' label='删除' mode='confirm' link data={row} url='/do/delete/approval' />
        </>
      )
    }
  }
}
  