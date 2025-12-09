import Other from './document/other.vue'
import Word from './document/word.vue'

export default {
  props: {
    params: Object,
  },
  render() {
    const { id, type, content } = this.params
    if (type === 1) {
      return <Word content={content} noteId={id} key={id} />
    }
    return <Other key={id} content={content} noteId={id} type={type} />
  },
}
