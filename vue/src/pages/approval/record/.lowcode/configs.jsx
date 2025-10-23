export default {
  url: "/do/select/record",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'approval/record',
  title: "审批日志",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"approvalId","label":"审批流程","type":"search","depend":"approval"},{"name":"nodeId","label":"审批节点","type":"search","depend":"approval_node"},{"name":"action","label":"操作"},{"name":"uid","label":"审批人","type":"user"}],
  columns: ["approvalId","nodeId","action","uid","createGmt","updateGmt"],
  condition: ["approvalId","nodeId"],
  slots: {
      header$() {
      return (
        <>
        <z-action label='添加日志' mode='dialog' fields={["approvalId","nodeId","createGmt","updateGmt","action","uid"]} type='primary' url='/do/put/record' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action label='修改' mode='dialog' fields={["approvalId","nodeId","action","uid"]} link data={row} url='/do/patch/approval_log' />
<z-action label='删除' mode='confirm' link data={row} url='/do/delete/record' />
        </>
      )
    }
  }
}
  