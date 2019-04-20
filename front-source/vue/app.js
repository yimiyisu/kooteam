import Todo from "./todo/index"
import TodoDetail from "./todo/detail"
import Calendar from "./calendar/index"
import Doc from "./doc/index"
import Search from "./doc/search"
import Plan from "./plan/index"
import TodoAdd from "./todo/add"
import CheckLogin from "./common/checkLogin"

import Init from "./util/init"
import ProjectDoc from "./doc/project"
import Board from "./board/index"
import UserSearch from "./common/userSearch"
import System from "./system/index"
import Project from "./project/index"
import Login from "./login/index"
import Report from "./report/index"


Init();
Vue.component("k-doc", Doc);
Vue.component("k-project-doc", ProjectDoc);
Vue.component("k-board", Board);
Vue.component("k-doc-search", Search);
Vue.component("k-check-login", CheckLogin);

Vue.component("k-calendar", Calendar);
Vue.component("k-todo", Todo);
Vue.component("k-todo-add", TodoAdd);
Vue.component("k-todo-detail", TodoDetail);
Vue.component("k-plan", Plan);
Vue.component("k-user-search", UserSearch);
Vue.component("k-system", System);// 系统组件
Vue.component("k-project", Project);
Vue.component("k-login", Login);
Vue.component("k-report", Report);
// Vue.component("k-test-sequential", Sequence);



