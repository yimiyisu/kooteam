export default {
  url: "/do/select/message_channel",
  conditionLimit:null,
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'message/channel',
  title: "消息渠道配置",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"creator","label":"创建人","type":"user"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"type","label":"渠道类型","code":"channelType"},{"name":"config","label":"配置","type":"map"},{"name":"title","label":"名称"},{"name":"configs","label":"配置","type":"inputTag"},{"name":"messageType","label":"消息类型","code":"messageType"}],
  columns: ["id","title","type"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action p='2kqpke8j' label='添加渠道' mode='dialog' fields={["title","type","messageType"]} type='primary' url='/do/put/message_channel' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action p='0lfrdv3d' label='编辑' mode='dialog' width='1000px' fields={["title","type","messageType","config"]} link data={row} url='/do/patch/message_channel' />
<z-action p='svbtxk5r' label='删除' mode='confirm' link data={row} url='/do/delete/message_channel' />
<z-action p='ya4qhxvh' label='配置' mode='dialog' fields={["configs"]} link data={row} url='/do/patch/message_channel' />
        </>
      )
    }
  }
}
  