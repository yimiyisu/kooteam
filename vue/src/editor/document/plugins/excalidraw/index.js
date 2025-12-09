import MoreView from './action.vue'
import NodeView from './node.vue'
export default function (Node, Renderer) {
  return Node.create({
    name: 'Excalidraw',
    group: 'inline',
    inline: true,
    atome: true,
    content: 'text*',
    defining: true,
    addAttributes() {
      return {
        type: {
          default: 'input', // 默认值
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
        demo: {
          parseHTML: dom => dom.getAttribute('data-demo'),
          renderHTML: attributes => ({
            'data-demo': attributes.demo,
          }),
        },
        desc: {
          parseHTML: dom => dom.getAttribute('data-desc'),
          renderHTML: attributes => ({
            'data-desc': attributes.desc,
          }),
        },
        unit: {
          parseHTML: dom => dom.getAttribute('data-unit'),
          renderHTML: attributes => ({
            'data-unit': attributes.desc,
          }),
        },
        def: {
          default: '',
          parseHTML: dom => dom.getAttribute('data-def'),
          renderHTML: attributes => ({
            'data-def': attributes.def,
          }),
        },
      }
    },
    parseHTML() {
      return [
        {
          tag: 'span.c-contract',
          getAttrs: dom => {
            return {
              type: dom.getAttribute('data-type'),
              id: dom.getAttribute('id'),
              label: dom.getAttribute('data-label'),
              demo: dom.getAttribute('data-demo'),
              desc: dom.getAttribute('data-desc'),
              def: dom.getAttribute('data-def'),
              unit: dom.getAttribute('data-unit'),
            }
          },
        },
      ]
    },
    renderHTML({ HTMLAttributes }) {
      return ['span', { ...HTMLAttributes, class: 'c-contract' }]
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
