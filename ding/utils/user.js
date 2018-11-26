let current = null;
const cacheKey = "currentUser";

const getUser = function () {
    if (current != null) {
        return current;
    }
    let user = dd.getStorageSync({key: cacheKey});
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
        dd.setStorageSync({key: cacheKey, data: current});
    } catch (e) {
    }
};
const clean = function () {
    current = null;
    dd.removeStorageSync({key: cacheKey});
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
    clean: clean,
    avator: avator
};