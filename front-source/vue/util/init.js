export default function () {
    let path = window.location.pathname;
    if (path === "/" || path.indexOf(".html") > -1) {
        return;
    }
    let url = "";
    if (zen.mode < 3) {
        url = "//a.yimiyisu.com/kooteam";
    }
    let css = "url('" + url + "/bg/3.jpg')";
    $("body").css("background-image", css);

    let navLinkDom = $("#J_navbar");
    let cls = "active";
    $("a", navLinkDom).el.forEach((item) => {
        let dom = $(item), href = dom.attr("href");
        if (href === path) {
            dom.parent().addClass("active")
        }
    });
    $("a", navLinkDom).on("click", function (e) {
        let target = $(e.target);
        $("." + cls, navLinkDom).removeClass(cls);
        target.parent().addClass(cls);
    });
}

