import Cos from "./cos";
import Oss from "./oss.vue";

export default {
    props: {
        value: Object,
    },
    render() {
        const { value } = this;
        if (!value || !value.storageMode) {
            return null;
        }
        const { storageMode } = value;
        if (storageMode === "cos") {
            return <Cos />;
        }
        if (storageMode === "oss") {
            return <Oss />;
        }
        return null;
    },
};
