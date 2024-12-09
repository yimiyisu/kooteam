import Doc from "./index";
const docType = { xspreadsheet: 1, excalidraw: 2, mindmap: 3 };
export default function () {
    tinymce.PluginManager.add("import", function (editor) {
        editor.ui.registry.addButton("import", {
            tooltip: "导入本地文档",
            icon: "export-word",
            onAction: function () {
                $.emit("importMceFile", editor);
            },
        });
    });
    tinymce.PluginManager.add("document", function (editor) {
        const doAct = async function (type) {
            const noteId = zen.instance.$route.query.id;
            const result = await $.post({
                url: "/do/put/note_content",
                data: { parentId: noteId, type: docType[type] },
            });
            const content =
                '<div id="J_' +
                result.id +
                '" data-type="' +
                type +
                '" class="k-doc" contenteditable="false"></div>';
            editor.insertContent(content);
            const dom = editor.contentDocument.body.querySelector(
                "#J_" + result.id
            );
            Doc(dom, true);
        };
        editor.ui.registry.addMenuButton("document", {
            tooltip: "插入文档",
            icon: "document-properties",
            fetch: function (callback) {
                const items = [
                    {
                        type: "menuitem",
                        text: "手绘白板",
                        onAction: () => doAct("excalidraw"),
                    },
                    {
                        type: "menuitem",
                        text: "思维导图",
                        onAction: () => doAct("mindmap"),
                    },
                    // {
                    //     type: "menuitem",
                    //     text: "甘特图",
                    //     onAction: () => doAct("gantt"),
                    // },
                    {
                        type: "menuitem",
                        text: "高级表格",
                        onAction: () => doAct("xspreadsheet"),
                    },
                ];
                callback(items);
            },
        });
    });
}
