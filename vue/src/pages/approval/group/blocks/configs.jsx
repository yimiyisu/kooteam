export default {
    conditionLimit: null,
    selectable: false,
    showIndex: false,
    compact: 150,
    entitys: [
        { name: "id", label: "编号", type: "search" },
        { name: "title", label: "流程名称" },
        { name: "path", label: "触发接口" },
        { name: "enable", label: "是否启用", type: "switch" },
    ],
    columns: ["title", "path", "enable"],
};
