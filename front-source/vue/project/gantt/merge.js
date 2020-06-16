const pallete = {
    "a": 'rgba(248, 14, 21, .5)',
    "b": 'rgba(190, 175, 4, .8)',
    "c": 'rgba(0, 159, 227, .7)',
    "d": 'rgba(121, 170, 28, .7)'
};

export default function (data) {
    let result = {
        rows: {},
        items: {}
    }, id, title, end;
    data.forEach((item) => {
        id = item._id;
        title = item.title;
        result.rows[id] = {
            id: id,
            label: title,
            // expanded: false
        };
        if (item.end) {
            end = item.end * 1000;
        } else {
            end = (item.start + 3600 * 3) * 1000;
        }
        result.items[id] = {
            id: id,
            label: title,
            time: {
                start: item.start * 1000,
                end
            },
            rowId: id,
            style: {background: pallete[item.quadrant || "b"]}
        }
    });

    return result;
}