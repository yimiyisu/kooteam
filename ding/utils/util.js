const date = function (value, span) {
    let date;
    if (typeof(value) == "number") {
        date = new Date(value * 1000)
    } else {
        date = value
    }
    if (span) {
        date.setDate(date.getDate() + span)
    }
    let year = date.getFullYear(),
        month = date.getMonth() + 1,
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();
    if (hour < 10) {
        hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    return year + "-" + month + "-" + date.getDate() + " " + hour + ":" + minute + ":" + second;
};

const idate = function (id) {
    let value = new Date(parseInt(id.toString().substring(0, 8), 16) * 1000);
    return date(value);
};

const time = function () {
    return "刚刚";
};

module.exports = {
    date: date,
    idate: idate,
    time: time
};
