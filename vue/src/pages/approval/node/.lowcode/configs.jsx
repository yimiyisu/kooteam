export default {
  url: "/do/select/approval_node",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'approval/node',
  title: "审批节点",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"title","label":"节点名称"},{"name":"flowId","label":"流程ID","type":"search"},{"name":"status","label":"状态","code":"nodeStatus"},{"name":"parentId","label":"父节点","type":"search","depend":"approval_node"},{"name":"uid","label":"审批人","type":"user"}],
  columns: ["title","status","uid","createGmt","updateGmt"],
  condition: ["uid","status"],
  slots: {
      header$() {
      return (
        <>
        <z-action p='vy8gdxcp0ab' label='添加节点' mode='dialog' fields={["title","uid"]} type='primary' url='/do/put/approval_node' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='6z35gkfyfrx' label='编辑' mode='dialog' fields={["title","status"]} link data={row} url='/do/patch/approval_node' />
<z-action p='672je4hqfs7' label='删除' mode='confirm' link data={row} url='/do/delete/approval_node' />
        </>
      )
    }
  }
}
  