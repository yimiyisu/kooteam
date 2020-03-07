import Todo from "./todo/index"
import TodoDetail from "./todo/detail"
import Calendar from "./calendar/index"
import Doc from "./doc/index"
import Search from "./doc/search"
import Thing from "./todo/thing"
// import Plan from "./plan/index"
import Init from "./util/init"
import Board from "./board/index"
import System from "./system/index"
import Login from "./login/index"
import Report from "./report/index"
import ProjectAdd from './project/add';
import Process from './project/process'

zen.loginURL = "/home.html";
Init();
Vue.component("k-doc", Doc);
Vue.component("k-thing", Thing);
Vue.component("k-board", Board);
Vue.component("k-doc-search", Search);

Vue.component("k-calendar", Calendar);
Vue.component("k-todo", Todo);
// Vue.component("k-todo-add", TodoAdd);
Vue.component("k-todo-detail", TodoDetail);
// Vue.component("k-plan", Plan);

Vue.component("k-system", System);     // 系统组件
Vue.component("k-login", Login);
Vue.component("k-report", Report);
Vue.component("k-project-add", ProjectAdd);
Vue.component("k-process", Process);
// Vue.component("k-test-sequential", Sequence);



