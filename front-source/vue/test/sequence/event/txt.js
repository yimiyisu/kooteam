import PatchAndQuery from "../util/patchAndQuery"

export default {
    dblclick: function (event) {
        let tempTxtId = event.currentTarget.raphaelid;
        let pathInfo = PatchAndQuery.queryPathType(tempTxtId);
        $.emit("editFlow", pathInfo.oldId);
    }
}