import Line from "../util/line"

const exlen = 10;
export default {
    calPoint: function (id, x, y, startX, startY) { //起点和终点不在同一节点上  计算最终的线条的points
        if (id) {
            return this.calEnd(id, x, y, startX, startY);
        } else {
            return this.calMidPoint(x, y, startX, startY);
        }
    },
    calPath: function (id, x, y, startX, startY) {  // 起点和终点不在同一节点上 用于计算画辅助线 SVG路径
        if (id) {
            let points = this.calEnd(id, x, y, startX, startY);
            return Line.temp4(points);
        } else {
            return Line.temp(startX, startY, x, y);
        }
    },
    calNearest: function (id, x, y) { // 计算距离节点边框最近位置
        let context = window.flowVue,
            nodeInfo = context.nodes[id],
            width = nodeInfo.data("width"),
            height = nodeInfo.data("height"),
            nodeX = nodeInfo.attrs.x,
            nodeY = nodeInfo.attrs.y;
        // 判断鼠标的位置距离那条边最近，终点就在哪条边上。
        let upRange = y - nodeY,
            downRange = nodeY + height - y,
            leftRange = x - nodeX,
            rightRange = nodeX + width - x;
        let arr = [{range: upRange, name: 1, endX: x, endY: nodeY},
                {range: downRange, name: 2, endX: x, endY: nodeY + height},
                {range: leftRange, name: 3, endX: nodeX, endY: y},
                {range: rightRange, name: 4, endX: nodeX + width, endY: y}],
            min = arr[0].range, mark = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].range < min) {
                min = arr[i].range;
                mark = i;
            }
        }
        let endX = arr[mark].endX, endY = arr[mark].endY, side = arr[mark].name, rate;
        let secondX, secondY;
        secondX = endX;
        secondY = endY;
        if (side === 1) {
            rate = (endX - nodeX) / width;
            secondY = endY - exlen;
        } else if (side === 2) {
            rate = (endX - nodeX) / width;
            secondY = endY + exlen;
        } else if (side === 3) {
            rate = (endY - nodeY) / height;
            secondX = endX - exlen;
        } else if (side === 4) {
            rate = (endY - nodeY) / height;
            secondX = endX + exlen;
        }
        return {
            x: endX,
            y: endY,
            side: side,
            rate: rate,
            secondX: secondX,
            secondY: secondY,
            width: width,
            height: height,
            nodeX: nodeX,
            nodeY: nodeY,
        }
    },
    calEnd: function (id, x, y, startX, startY) {  // 计算线条6个点的坐标（最多6个）
        let context = window.flowVue;
        let nodeInfo = context.nodes[id];
        let width = nodeInfo.data("width");
        let height = nodeInfo.data("height");
        let nodeX = nodeInfo.attrs.x;
        let nodeY = nodeInfo.attrs.y;
        // 判断鼠标的位置距离那条边最近，终点就在哪条边上。
        let upRange = y - nodeY,
            downRange = nodeY + height - y,
            leftRange = x - nodeX,
            rightRange = nodeX + width - x;
        let arr = [{range: upRange, name: "up", endX: x, endY: nodeY},
                {range: downRange, name: "down", endX: x, endY: nodeY + height},
                {range: leftRange, name: "left", endX: nodeX, endY: y},
                {range: rightRange, name: "right", endX: nodeX + width, endY: y}],
            min = arr[0].range, mark = 0;
        for (let i = 0; i < arr.length; i++) {
            if (arr[i].range < min) {
                min = arr[i].range;
                mark = i;
            }
        }
        // 计算第六个点（终点）的坐标
        let endX = arr[mark].endX, endY = arr[mark].endY;

        let secondX, secondY, thirdX, thirdY, fifthX, fifthY, fourthX, fourthY;

        // 计算第五个点的坐标
        fifthX = endX;
        fifthY = endY;
        if (mark === 0) {
            fifthY = endY - exlen;
        } else if (mark === 1) {
            fifthY = endY + exlen;
        } else if (mark === 2) {
            fifthX = endX - exlen;
        } else if (mark === 3) {
            fifthX = endX + exlen;
        }

        //计算第二个点的坐标
        secondX = startX;
        secondY = startY;
        if (startY <= nodeY) {
            secondY = startY + exlen;
        } else if (startY >= nodeY + height) {
            secondY = startY - exlen;
        } else if (startY > nodeY && startY < nodeY + height) {
            if (startX <= nodeX) {
                secondX = startX + exlen;
            }
            else if (startX >= nodeX + width) {
                secondX = startX - exlen;
            } else if (startX > nodeX && startX < nodeX + width) {   //  起点在节点内部 特殊情况

            }
        }
        // 计算第三第四个点的坐标
        thirdX = fifthX;
        thirdY = secondY;
        fourthX = fifthX;
        fourthY = fifthY;
        if (startY < nodeY) {
            if (mark === 1) {
                thirdX = nodeX - exlen;
                fourthX = nodeX - exlen;
            }
        } else if (startY > nodeY + height) {
            if (mark === 0) {
                thirdX = nodeX + width + exlen;
                fourthX = nodeX + width + exlen;
            }
        }
        if (startX < nodeX) {
            thirdX = secondX;
            thirdY = fourthY;
            if (mark === 3) {
                thirdY = nodeY - exlen;
                fourthY = nodeY - exlen;
            }
        } else if (startX > nodeX + width) {
            thirdX = secondX;
            thirdY = fourthY;
            if (mark === 2) {
                thirdY = nodeY + height + exlen;
                fourthY = nodeY + height + exlen;
            }
        }
        let points2 = [{x: startX, y: startY}, {x: secondX, y: secondY}, {x: thirdX, y: thirdY},
            {x: fourthX, y: fourthY}, {x: fifthX, y: fifthY}, {x: endX, y: endY}];

        return this.delRepat(points2);
    },
    delRepat: function (points) {  // 去掉重复的点，或者三个点在一条直线上的中间点
        for (let i = 0; i < points.length; i++) {
            if (i + 2 < points.length) {
                let x1 = points[i].x, x2 = points[i + 1].x, x3 = points[i + 2].x,
                    y1 = points[i].y, y2 = points[i + 1].y, y3 = points[i + 2].y;
                if ((x1 === x2 && x2 === x3) || (y1 === y2 && y2 === y3)) {
                    points.splice(i + 1, 1);
                    i--;
                }
            }
        }
        return points;
    },
    calMidPoint: function (x4, y4, x1, y1) {   // 计算两点连接折线，中间点坐标
        let width = Math.abs(x1 - x4),
            height = Math.abs(y1 - y4), x2, y2, x3, y3;
        if (width > height) {
            x2 = x1 + (x4 - x1) / 2;
            y2 = y1;
            x3 = x2;
            y3 = y4;
        } else {
            x2 = x1;
            y2 = y1 + (y4 - y1) / 2;
            x3 = x4;
            y3 = y2;
        }
        return [{x: x1, y: y1}, {x: x2, y: y2}, {x: x3, y: y3}, {x: x4, y: y4}];
    },
    calPointSE: function (id, startX, startY, endX, endY) { // 计算起点和终点都在节点上，计算最终的线条的points
        let startCal = this.calNearest(id, startX, startY);
        let endCal = this.calNearest(id, endX, endY);
        let width = startCal.width, height = startCal.height;
        let points = [{x: startCal.x, y: startCal.y}, {x: startCal.secondX, y: startCal.secondY}];
        // 延长线
        if (startCal.side !== endCal.side) {    // 起点和终点不在一条边上
            if ((startCal.side + endCal.side) === 3) { // 上 下
                points.push({x: startCal.nodeX + width + exlen, y: startCal.secondY});
                points.push({x: startCal.nodeX + width + exlen, y: endCal.secondY});
            } else if ((startCal.side + endCal.side) === 7) { // 左 右
                points.push({x: startCal.secondX, y: startCal.nodeY + height + exlen});
                points.push({x: endCal.secondX, y: startCal.nodeY + height + exlen});
            } else {
                if (startCal.side === 1 || startCal.side === 2) {
                    points.push({x: endCal.secondX, y: startCal.secondY});
                }
                else {
                    points.push({x: startCal.secondX, y: endCal.secondY});
                }
            }
        }
        points.push({x: endCal.secondX, y: endCal.secondY}, {x: endCal.x, y: endCal.y});
        return points;
    },
    calPathSE: function (id, startX, startY, endX, endY) { // 起点和终点都在该节点上 用于计算画辅助线 SVG路径
        let path;
        let points = this.calPointSE(id, startX, startY, endX, endY);
        path = Line.temp4(points);
        return path;
    }
}