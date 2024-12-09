import DingDing from "./dingding.vue";
import Feishu from "./feishu.vue";
import LADP from "./ladp.vue";
import Wework from "./wework.vue";

export default {
    props: {
        value: Object,
    },
    render() {
        const { value } = this;
        if (!value || !value.loginMode) {
            return null;
        }
        const { loginMode } = value;
        if (loginMode === "dingding") {
            return <DingDing />;
        }
        if (loginMode === "feishu") {
            return <Feishu />;
        }
        if (loginMode === "ladp") {
            return <LADP />;
        }
        if (loginMode === "wework") {
            return <Wework />;
        }
        return null;
    },
};
