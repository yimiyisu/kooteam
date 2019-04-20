const colors = {
    a: "#f80e15",
    b: "#d9b403",
    c: "#009fe3",
    d: "#79AA1C"
};
const oneDay = 86400;

let unixTime = (unix) => {
    let unixtimestamp = new Date(unix * 1000);
    let year = 1900 + unixtimestamp.getYear();
    let month = "0" + (unixtimestamp.getMonth() + 1);
    let date = "0" + unixtimestamp.getDate();
    let hour = "0" + unixtimestamp.getHours();
    let minute = "0" + unixtimestamp.getMinutes();
    let second = "0" + unixtimestamp.getSeconds();
    if (hour === "00") {
        return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length)
    } else {
        return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length)
            + " " + hour.substring(hour.length - 2, hour.length) + ":"
            + minute.substring(minute.length - 2, minute.length) + ":"
            + second.substring(second.length - 2, second.length);
    }
}

function _convert(current) {
    let item = {
        id: current._id,
        title: current.title
    };
    if (current.quadrant) {
        item.color = colors[current.quadrant];
    }
    if (current.start > 0) {
        // item.start = current.start * 1000
        item.start = unixTime(current.start);
    }
    if (current.end > 0) {
        if (current.end - current.start > oneDay) {
            item.allDay = true;
        } else {
            if (current.end > current.start) {
                item.end = unixTime(current.end);
            }
        }
    }
    return item;
}

export default {
    convert: function (things) {
        if (!Array.isArray(things)) {
            return _convert(things);
        }
        let result = [], item, current;
        for (let i = 0; i < things.length; i++) {
            current = things[i];
            item = _convert(current);
            result.push(item);
        }
        return result;
    },
    unixTime: unixTime,
    getColor: function (quadrant) {
        return colors[quadrant];
    }
}