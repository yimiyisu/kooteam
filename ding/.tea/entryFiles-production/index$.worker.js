
require('./config$');
require('./importScripts$');
function success() {
require('../..//app');
require('../../pages/components/icon/index');
require('../../pages/components/todo-add/index');
require('../../pages/components/todo/index');
require('../../pages/todo/detail/components/endtime/index');
require('../../pages/todo/detail/components/owner/index');
require('../../pages/todo/detail/components/priority/index');
require('../../pages/todo/detail/components/project/index');
require('../../pages/todo/detail/components/remind/index');
require('../../pages/friend/components/person/index');
require('../../pages/todo/index');
require('../../pages/projects/projects');
require('../../pages/my/my');
require('../../pages/todo/detail/detail');
require('../../pages/my/create/index');
require('../../pages/my/todo/index');
require('../../pages/my/message/index');
require('../../pages/my/userinfo/index');
require('../../pages/my/login/index');
require('../../pages/my/help/index');
require('../../pages/projects/add/index');
require('../../pages/projects/chart/index');
require('../../pages/projects/menbers/menbers');
require('../../pages/projects/docs/docs');
require('../../pages/projects/detail/index');
require('../../pages/projects/set/set');
require('../../pages/friend/index');
require('../../pages/friend/detail/index');
require('../../pages/my/userinfo/changeInfo/changeInfo');
}
self.bootstrapApp ? self.bootstrapApp({ success }) : success();
