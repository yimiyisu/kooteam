export default {
    rect: function (x, y, width, height, isSmall) {
        if (width === undefined || width === null) {
            width = 80
        }
        if (height === undefined || height === null) {
            height = 48
        }
        let color = "#009fe3";
        let r = (width / 7) < (height / 5) ? (width / 7) : (height / 5);
        r = (r < 10) ? r : 10;
        let path = ["M" + x, y + r, "A" + r, r, 0, 0, 1, x + r, y, "L" + (x + width - r), y,
            "A" + r, r, 0, 0, 1, x + width, y + r, "L" + (x + width), y + height - r,
            "A" + r, r, 0, 0, 1, x + width - r, y + height, "L" + (x + r), y + height,
            "A" + r, r, 0, 0, 1, x, y + height - r, "Z"].join(",");
        if (isSmall) {
            return path;
        } else {
            return {width: width, height: height, color: color, path: path, text: "矩形"};
        }
    },
    circle: function (x, y, width, height, isSmall) {
        if (width === undefined || width === null) {
            width = 72
        }
        if (height === undefined || height === null) {
            height = 72
        }
        let color = "#79aa1c",
            r = width / 2,
            path = ["M" + x, y + height / 2, "a" + r, r, 0, 1, 0, width, 0, "a" + r, r, 0, 1, 0, -width, 0, "Z"].join(",");
        if (isSmall) {
            return path;
        } else {
            return {width: width, height: height, color: color, path: path, text: "圆形"};
        }
    },
    angle4: function (x, y, width, height, isSmall) {
        if (width === undefined || width === null) {
            width = 80
        }
        if (height === undefined || height === null) {
            height = 72
        }
        let color = "#f80e15",
            path = ["M" + (x + width / 2), y, "L" + (x + width), y + height / 2, "L" + (x + width / 2), y + height, "L" + x, y + height / 2, "Z"].join(",");
        if (isSmall) {
            return path;
        } else {
            return {width: width, height: height, color: color, path: path, text: "菱形"};
        }
    },
    ellipse: function (x, y, width, height, isSmall) {
        if (width === undefined || width === null) {
            width = 80
        }
        if (height === undefined || height === null) {
            height = 48
        }
        let color = "#E7C004",
            r = height / 2,
            path = ["M" + (x + r), y, "a" + r, r, 0, 1, 0, 0, height, "L" + (x + width - r), y + height, "a" + r, r, 0, 1, 0, 0, -height, "Z"].join(",");
        if (isSmall) {
            return path;
        } else {
            return {width: width, height: height, color: color, path: path, text: "椭圆"};
        }
    },
    document: function (x, y, width, height, isSmall) {
        if (width === undefined || width === null) {
            width = 80
        }
        if (height === undefined || height === null) {
            height = 48
        }
        let color = "#e17aff",
            path = ["M" + x, y, "L" + (x + width), y, "L" + (x + width), y + (height * 7 / 9),
                "Q", x + (width * 3 / 4), y + (height * 5 / 9), x + (width / 2), y + (height * 7 / 9),
                "Q", x + (width / 4), y + height, x, y + (height * 7 / 9), "Z"].join(" ");
        if (isSmall) {
            return path;
        } else {
            return {width: width, height: height, color: color, path: path, text: "文本框"};
        }

    },
    step: function (x, y, width, height, isSmall) {
        if (width === undefined || width === null) {
            width = 80
        }
        if (height === undefined || height === null) {
            height = 48
        }
        let color = "#388bdd",
            path = ["M" + (x), y, "L" + (x + width * 5 / 6), y, "L" + (x + width), y + (height / 2),
                "L" + (x + width * 5 / 6), y + height, "L" + (x), y + height, "L" + (x + width / 6), y + (height / 2),
                "Z"].join(" ");
        if (isSmall) {
            return path;
        } else {
            return {width: width, height: height, color: color, path: path, text: "步骤"};
        }

    },
    get: function (type, x, y, width, height, isSmall) {
        if (type === "rect") {
            return this.rect(x, y, width, height, isSmall);
        }
        if (type === "circle") {
            return this.circle(x, y, width, height, isSmall);
        }
        if (type === 'angle4') {
            return this.angle4(x, y, width, height, isSmall);
        }
        if (type === 'ellipse') {
            return this.ellipse(x, y, width, height, isSmall);
        }
        if (type === 'document') {
            return this.document(x, y, width, height, isSmall);
        }
        if (type === 'step') {
            return this.step(x, y, width, height, isSmall);
        }
    }
}