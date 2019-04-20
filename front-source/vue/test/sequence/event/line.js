import PatchAndQuery from "../util/patchAndQuery"

export default {
    click: function (event) {
        let id = event.currentTarget.raphaelid;
        let tempPath = window.flowVue.r.getById(id);
        window.flowVue.currentTargetId = id;
        tempPath.attr({
            "stroke-width": 5,
        });
        let pathInfo = PatchAndQuery.queryPathType(id);
        window.flowVue.currentTargetId = pathInfo.oldId;
    },
    mouseover: function (event) {
        let id = event.currentTarget.raphaelid;
        let tempPath = window.flowVue.r.getById(id);
        tempPath.attr({
            "stroke-width": 3,
        });
    },
    mouseout: function (event) {
        let id = event.currentTarget.raphaelid;
        let tempPath = window.flowVue.r.getById(id);
        tempPath.attr({
            "stroke-width": 1,
        });
    },
    dbclick: function () {
        let id = window.flowVue.currentTargetId;
        $.emit("editFlow", id);
    }
}