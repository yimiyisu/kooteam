export default {
  url: "/do/select/note",
  compact: 220,
  path: 'note/square',
  title: "知识库广场",
  entitys: [{"name":"id","label":"编号"},{"name":"title","label":"标题"},{"name":"createId","label":"创建人","type":"user"},{"name":"content","label":"知识库目录","type":"table"},{"name":"projectId","label":"所属项目","type":"search"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"},{"name":"parentId","label":"父级对象","type":"search","depend":"note"},{"name":"pub","label":"公共读","type":"switch"},{"name":"groupId","label":"分组ID","type":"search","depend":"note_group"},{"name":"configs","label":"综合配置","type":"json"}],
  columns: ["title","createId","updateGmt"],
  condition: ["title","createId"],
  slots: {
    action$({ row }) {
      return (
        <>
          <z-action label='访问知识库' href={`/kooteam/knowledge?id=${row.id}`} mode='blank' link map={{}} />
        </>
      )
    }
  }
}
  