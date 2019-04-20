function loadUser(win, callback) {
    let config = win.localStorage["config"];
    if (config) {
        zen.user = JSON.parse(config);
        if (zen.user.id) {
            return callback(zen.user);
        }
    }
    $.http(null, "/system/my.do", function (reback) {
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
        let navLinkDom = $("#J_navbar");
        let cls = "active";
        $("h2", navLinkDom).on("click", function () {
            $.goto(zen.user.home);
        });
        $("a", navLinkDom).on("click", function (e) {
            let target = $(e.currentTarget).parent();
            if (!target.length) {
                return;
            }
            if (target[0].tagName !== "DD") {
                return;
            }
            if (target.hasClass(cls)) {
                return;
            }
            $("." + cls, navLinkDom).removeClass(cls);
            target.addClass(cls);
        });
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

}

