import App from "./app/index.vue";
import components from "./components/index";
import dict from "./pages/dict";
import routes from "./pages/routes";
import "./sass/index.scss";

__webpack_public_path__ = zen.path("kooteam");
zen.loginURL = "/";
// 加载用户信息
zen.setup({ com: App, routes, dict, components });
