let projects = Vue.observable({}), ids = [], getData = $.debounce(async function () {
    let data = await $.get({ids: ids}, '/project/getByIds.do');
    ids = [];
    data.forEach((item) => {
        let categorys = item.category;
        categorys && projectStore.set(item._id, JSON.parse(categorys));
    })
}, 300);
let projectStore = {
    get(id) {
        if (projects[id]) return projects[id];
        ids.push(id);
        Vue.set(projects, id, []);
        getData();
        return projects[id];
    },
    set(id, categorys) {
        if (!categorys) {
            return;
        }
        projects[id] = categorys;
    }
};
export default projectStore