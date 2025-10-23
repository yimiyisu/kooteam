import SystemAuth from "./auth/auth";
import SystemBook from "./book/book";
import SystemDatav from "./datav/datav";
import SystemDatavDesinger from "./datavDesinger/datavDesinger";
import SystemDepartment from "./department/department";
import SystemDepartmentUser from "./departmentUser/departmentUser";
import SystemEmployee from "./employee/employee";
import SystemLogManager from "./logManager/logManager";
import SystemMonitor from "./monitor/monitor";
import SystemMp from "./mp/mp";
import SystemOauth from "./oauth/oauth";
import SystemPermission from "./permission/permission";
import SystemRole from "./role/role";
import SystemRoleApp from "./roleApp/roleApp";
import SystemRoleUser from "./roleUser/roleUser";
import SystemSet from "./set/set";
import SystemStat from "./stat/stat";
import SystemUser from "./user/user";

export default {
	'system/auth': SystemAuth,
	'system/book': SystemBook,
	'system/datav': SystemDatav,
	'system/datavDesinger': SystemDatavDesinger,
	'system/department': SystemDepartment,
	'system/departmentUser': SystemDepartmentUser,
	'system/employee': SystemEmployee,
	'system/logManager': SystemLogManager,
	'system/monitor': SystemMonitor,
	'system/mp': SystemMp,
	'system/oauth': SystemOauth,
	'system/permission': SystemPermission,
	'system/role': SystemRole,
	'system/roleApp': SystemRoleApp,
	'system/roleUser': SystemRoleUser,
	'system/set': SystemSet,
	'system/stat': SystemStat,
	'system/user': SystemUser
}