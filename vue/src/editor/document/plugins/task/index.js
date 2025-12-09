import MoreView from './action.vue'
import NodeView from './node.vue'
export default function (Node, Renderer) {
  return Node.create({
    name: 'taskNode',
    group: 'block',
    atome: true,
    selectable: true,
    draggable: true,
    content: '',
    defining: true,
    addAttributes() {
      return {
        type: {
          default: 'taskNode', // 默认值
          parseHTML: dom => dom.getAttribute('data-type'),
          renderHTML: attributes => ({
            'data-type': attributes.type,
          }),
        },
        id: {
          parseHTML: dom => dom.getAttribute('id'),
          renderHTML: attributes => ({
            id: attributes.id,
          }),
        },
        label: {
          parseHTML: dom => dom.getAttribute('data-label'),
          renderHTML: attributes => ({
            'data-label': attributes.label,
          }),
        },
        thingId: {
          parseHTML: dom => dom.getAttribute('data-thingId'),
          renderHTML: attributes => ({
            'data-thingId': attributes.thingId,
          }),
        },
      }
    },
    parseHTML() {
      return [
        {
          tag: 'div.c-node',
          getAttrs: dom => {
            return {
              type: dom.getAttribute('data-type'),
              id: dom.getAttribute('id'),
              label: dom.getAttribute('data-label'),
              thingId: dom.getAttribute('data-thingId'),
            }
          },
        },
      ]
    },
    renderHTML({ HTMLAttributes }) {
      return ['div', { ...HTMLAttributes, class: 'c-node' }]
    },
    addNodeView() {
      return Renderer(NodeView)
    },
    handleDelete() {
      if (this.editor.isActive(this.name)) {
        this.editor.commands.deleteNode(this.name)
        return true
      }
      return false
    },
    addOptions() {
      return {
        more(attrs) {
          return <MoreView {...attrs} />
        },
      }
    },
  })
}
