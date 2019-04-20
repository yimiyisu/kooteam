export default function (dom, parent) {
    if (!parent) {
        parent = $(window);
    }
    let width = parent.width(),
        height = parent.height(),
        left = parseInt(width - 18000) / 2, top = parseInt(height - 18000) / 2 - 100;
    dom.style.left = left + "px";
    dom.style.top = top + "px";
}