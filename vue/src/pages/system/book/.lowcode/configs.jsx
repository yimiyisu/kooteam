export default {
  url: "/do/select/book_demo",
  selectable: false,
  showIndex: false,
  compact: 220,
  path: 'system/book',
  title: "预约信息",
  entitys: [{"name":"id","label":"编号","type":"search"},{"name":"receivedTime","label":"预约时间"},{"name":"name","label":"姓名"},{"name":"mobile","label":"手机号"},{"name":"email","label":"电子邮箱地址"},{"name":"useCase","label":"应用需求说明","type":"editor"},{"name":"inviteEmail","label":"邀请访客电子邮箱","type":"table"},{"name":"createGmt","label":"创建时间","type":"date"},{"name":"updateGmt","label":"更新时间","type":"date"}],
  columns: ["name","receivedTime","email","useCase"],
  condition: ["name","receivedTime"],
  slots: {
    action$({ row }) {
      return (
        <>
          <z-action label='预约详情' mode='drawer' width='1000px' fields={["name","receivedTime","mobile","email","useCase","inviteEmail","createGmt","updateGmt"]} from='/do/get/book_demo' link data={row} includeTitle='l' />
        </>
      )
    }
  }
}
  