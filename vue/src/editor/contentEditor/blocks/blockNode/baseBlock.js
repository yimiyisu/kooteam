import BlockInsert from "./blockInsert.vue";
import BlockNodeView from "./blockView.vue";

export default function (Node, Renderer) {
    console.log(`创建统一的块级节点插件`);

    return Node.create({
        name: "blockNode",
        group: "block",
        atom: true,
        defining: true,

        addAttributes() {
            return {
                content: {
                    default: "",
                },
                noteId: {
                    default: "",
                },
                type: {
                    default: 3, // 默认思维导图
                },
                blockType: {
                    default: "mindmap", // 文本类型标识
                }
            };
        },

        parseHTML() {
            return [
                {
                    tag: `div[data-block-type]`,
                    getAttrs: (dom) => ({
                        content: dom.getAttribute("data-content"),
                        noteId: dom.getAttribute("data-note-id"),
                        type: parseInt(dom.getAttribute("data-type")),
                        blockType: dom.getAttribute("data-block-type"),
                    }),
                },
            ];
        },

        renderHTML({ node }) {
            return [
                "div",
                {
                    "data-type": node.attrs.type,
                    "data-block-type": node.attrs.blockType,
                    "data-content": node.attrs.content,
                    "data-note-id": node.attrs.noteId,
                    class: `block-node block-${node.attrs.blockType}`,
                },
            ];
        },

        addNodeView() {
            return Renderer(BlockNodeView);
        },

        addOptions() {
            return {
                more(attrs) {
                    return <BlockInsert {...attrs} />;
                },
            };
        },
    });
}