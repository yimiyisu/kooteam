export default function () {
    Raphael.fn.mindLine = function (id, path) {
        let eleId = "l_" + id;
        let line = this.getById(eleId);
        if (line) {
            line.attr({path: path});
        } else {
            line = this.path(path).attr({
                stroke: "#aaa",
                "stroke-width": 1,
                fill: "none"
            });
            // line.node.id = eleId;
            line.id = eleId;
        }
    }
}