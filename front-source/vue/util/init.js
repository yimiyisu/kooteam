function loadUser(win, callback) {
    let config = win.localStorage["config"], uid = $.cookie("uid");
    if (config && uid) {
        zen.user = JSON.parse(config);
        if (uid === zen.user.id) {
            return callback(zen.user);
        }
    }
    $.post(null, "/system/my.do", function (reback) {
        let data = reback.data;
        let user = {
            id: data._id,
            nick: data.nick,
            username: data.username,
            home: data.home,
            skin: data.skin,
            mode: data.mode,
            calendar: data.calendar
        };
        zen.user = user;
        win.localStorage["config"] = JSON.stringify(user);
        callback(user);
    });
}

function bindMenu(user) {
    $(document).ready(function () {
        if (user.skin) {
            let url = "";
            if (zen.mode < 3) {
                url = "//a.yimiyisu.com/kooteam";
            }
            let css = "url('" + url + "/bg/" + user.skin + ".jpg')";
            $("body").css("background-image", css);
        }
    });
}

export default function () {
    let win = window;
    let path = win.location.pathname;
    if (path === "/" || path.indexOf(".html") > -1) {
        return;
    }
    loadUser(win, function (user) {
        bindMenu(user);
    });
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

