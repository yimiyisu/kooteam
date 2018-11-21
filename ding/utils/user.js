let current = null;

const getUser = function () {
    if (current != null) {
        return current;
    }
    let user = dd.getStorageSync({key: "user"});
    if (!user.data) {
        return null;
    }
    current = user.data;
    return current;
};

const setUser = function (data) {
    if (!data) {
        return;
    }
    current = {
        nick: data.nick,
        ukey: data.ukey,
        uid: data.uid,
        appId: data.appId
    };
    try {
        dd.setStorageSync({key: "user", data: current});
    } catch (e) {
    }
};
const imgDomain = "https://img.yimiyisu.com/";
const avator = function (uid) {
    if (!uid || uid.length < 12) {
        return imgDomain + "avator.jpg";
    }
    let path = uid.substr(0, 4) + "/" + uid.substr(4, 2) + "/" + uid.substr(6) + ".jpg"
    return imgDomain + path;
};

module.exports = {
    get: getUser,
    set: setUser,
    avator: avator
};