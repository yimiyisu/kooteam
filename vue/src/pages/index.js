import approval from './approval/index';
import manHour from './manHour/index';
import message from './message/index';
import note from './note/index';
import okr from './okr/index';
import projects from './projects/index';
import report from './report/index';
import state from './state/index';
import system from './system/index';
import task from './task/index';

export default {
  ...approval,
	...manHour,
	...message,
	...note,
	...okr,
	...projects,
	...report,
	...state,
	...system,
	...task
};