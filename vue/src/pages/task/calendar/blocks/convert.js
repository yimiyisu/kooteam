const oneDay = 86400;

function _convert(current, colors) {
    let item = {
        id: current.id,
        title: current.title,
        color: colors[current.quadrant],
    };
    item.start = (current.start || current.updateGmt) * 1000;
    if (current.end > 0) {
        if (current.end - current.start > oneDay) {
            item.allDay = true;
        } else {
            if (current.end > current.start) {
                item.end = current.end * 1000;
            }
        }
    } else {
        item.end = item.start * 9000 * 1000;
    }
    return item;
}

export default function (things, colors) {
    if (!Array.isArray(things)) {
        return _convert(things, colors);
    }
    let result = [],
        item,
        current;
    for (let i = 0; i < things.length; i++) {
        current = things[i];
        item = _convert(current, colors);
        result.push(item);
    }
    return result;
}
