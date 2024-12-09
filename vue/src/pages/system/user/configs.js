export default [
    { label: "用户ID", name: "id" },
    { label: "登陆名", name: "username" },
    { label: "昵称", name: "nick" },
    { label: "账户密码", name: "password", type: "password" },
    { label: "确认密码", name: "password2", type: "password" },
    { label: "关键字", name: "keyword" },
    { label: "用户状态", name: "status" },
    { label: "系统角色", name: "role", code: "systemRole" },
    { label: "加入时间", name: "createGmt" },
    {
        label: "系统角色",
        name: "role",
        code: "accessRole",
    },
    { label: "更新时间", name: "updateGmt", type: "timestamp" },
];
