import note from './note/index';
import projects from './projects/index';
import report from './report/index';
import system from './system/index';
import task from './task/index';

export default {
  ...note,
	...projects,
	...report,
	...system,
	...task
};