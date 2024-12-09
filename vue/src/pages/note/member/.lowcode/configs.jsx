export default {
  url: "/do/select/noteUserByNote",
  compact: 220,
  path: 'note/member',
  title: "知识库用户",
  entitys: [{"name":"id","label":"编号"},{"name":"uid","label":"用户ID","type":"user"},{"name":"noteId","label":"笔记id","type":"search"},{"name":"type","label":"用户类型","code":"noteUserType"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"tag","label":"是否加星","type":"switch"}],
  columns: ["uid","type","updateGmt"],
  condition: [],
  slots: {
      header$() {
      return (
        <>
        <z-action label='添加用户' fields={["uid","type"]} url='/do/put/note_user' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action label='删除' mode='confirm' link data={row} url='/do/delete/note_user' />
        </>
      )
    }
  }
}
  