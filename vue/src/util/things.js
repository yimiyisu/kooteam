export default {
    sort: function (id, status, things) {
        let item = null,
            current;
        for (let i = 0; i < things.length; i++) {
            current = things[i];
            if (current.id === id) {
                item = things.splice(i, 1);
                break;
            }
        }
        if (item == null) {
            return;
        }
        item = item[0];
        if (status === 0) {
            return things.unshift(item);
        }
        for (let i = things.length - 1; i >= 0; i--) {
            current = things[i];
            if (current.status === 0) {
                things.splice(i + 1, 0, item);
                return;
            }
        }
        things.unshift(item);
    },
};
