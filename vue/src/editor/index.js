import Other from "./document/other.vue";
// import Word from "./document/word.vue";
import ContentEditor from "./contentEditor/contentEditor.vue";

export default {
    props: {
        params: Object,
    },
    render() {
        const { id, type, content } = this.params;
        // console.log(type);
        // console.log(this.params);

        if (type === 1) {
            return <ContentEditor content={content} noteId={id} key={id} type={type} />;
            // return <Word content={content} noteId={id} key={id} />;
        }
        return <Other key={id} content={content} noteId={id} type={type} />;
    },
};
