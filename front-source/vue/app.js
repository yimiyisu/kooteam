import Todo from "./todo/index"
import TodoDetail from "./todo/detail"
import Calendar from "./todo/calendar/index"
import Doc from "./doc/index"
import Thing from "./todo/thing"
import ThingRestore from "./common/thingRestore"
import Init from "./util/init"
import System from "./system/index"
import Login from "./login/index"
import Report from "./report/index"
import TodoAdd from "./todo/add/index"
import Project from "./project/index"
import ProjectView from "./project/view"
import ThingStatus from "./todo/status"

zen.loginURL = "/home.html";
Init();
Vue.component("k-doc", Doc);
Vue.component("k-thing", Thing);
Vue.component("k-thing-restore", ThingRestore);


Vue.component("k-calendar", Calendar);
Vue.component("k-todo", Todo);
Vue.component("k-todo-add", TodoAdd);
Vue.component("k-todo-detail", TodoDetail);
Vue.component("k-thing-status", ThingStatus);

Vue.component("k-system", System);     // 系统组件
Vue.component("k-login", Login);
Vue.component("k-report", Report);
Vue.component("k-project", Project);
Vue.component("k-project-view", ProjectView);
// Vue.component("k-test", Test);
// Vue.component("k-test-sequential", Sequence);



