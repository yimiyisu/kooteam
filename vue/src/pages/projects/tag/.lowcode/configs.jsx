export default {
  title: '标签管理',
  path: 'projects/tag',
  entitys: [
    { name: 'id', label: '编号' },
    { name: 'name', type: 'input', label: '名称' },
    { name: 'nick', label: '昵称' },
    { name: 'ukey', label: '密钥' },
    { name: 'createUid', type: 'input', label: '创建人' },
    {
      name: 'status',
      type: 'switch',
      label: '状态',
      url: '/app/updateStatus.do',
    },
    {
      name: 'config',
      type: 'map',
      default: {},
      fields: [
        { name: 'api', label: '接口地址', type: 'input' },
        { name: 'version', label: '资源版本', type: 'input' },
      ],
    },
  ],
  columns: ['id', 'createUid', 'nick', 'unionid', 'dingId', 'ukey'],
  condition: ['id', 'createUid', 'nick', 'unionid', 'dingId', 'ukey'],
  slots: {
    header$() {
      return (
        <>
          <z-action
            fields={['id', 'createUid', 'nick', 'unionid', 'dingId', 'ukey']}
            url='/do/put/member'
            label='添加'
            title='hello'
          />
        </>
      )
    },
    action$({ row }) {
      return (
        <>
          <z-action
            link
            mode='drawer'
            title={row.nick + '侧滑菜单'}
            label='侧滑'
          />
          <z-action
            link
            fields={['id', 'createUid', 'nick', 'unionid', 'dingId', 'ukey']}
            data={row}
            url='/do/patch/member'
            title={'编辑' + row.nick}
            label='编辑'
          />
          <z-action
            link
            title='确定删除吗？'
            data={row}
            url='/do/delete/member'
            label='删除'
          />
        </>
      )
    },
  },
}
