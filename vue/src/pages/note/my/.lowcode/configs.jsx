export default {
  url: "/do/join/myNote",
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'note/my',
  title: "我的知识库",
	tabs: {"list":[{"label":"我收藏的","value":"1","id":"wpp8f1k28jc"}],"keyword":"tag"},
  entitys: [{"name":"id","label":"编号"},{"name":"title","label":"标题"},{"name":"createId","label":"创建人","type":"user"},{"name":"content","label":"知识库目录","type":"table"},{"name":"projectId","label":"所属项目","type":"search"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"pub","label":"公共读","type":"switch"},{"name":"groupId","label":"分组ID","type":"search","depend":"note_group"},{"name":"configs","label":"综合配置","type":"json"}],
  columns: ["updateGmt","createGmt"],
  condition: ["title"],
  slots: {
      header$() {
      return (
        <>
        <z-action label='新建知识库' fields={["title","pub"]} url='/do/put/note' />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action label='编辑' data={row} mode='drawer' href='/note/detail' link map={{"id":"id"}} includeTitle='r' />
<z-action label='退出' mode='confirm' link data={row} url='/do/select/note_user' />
        </>
      )
    }
  }
}
  