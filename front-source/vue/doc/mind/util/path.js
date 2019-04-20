const svg_ratios_1 = 0.4, //svg 曲线比例  第一个
    svg_ratios_2 = 0.3;//svg 曲线比例 二个中间点

export default {
    pathZ: function (startX, startY, endX, endY, isLeft) {
        let exlen = 8, secondX, fourthX, thirdY;
        if (!isLeft) {
            secondX = startX + exlen;
            fourthX = startX + exlen * 2;
        } else {
            secondX = startX - exlen;
            fourthX = startX - exlen * 2;
        }
        if (startY > endY) {
            thirdY = endY + exlen;
        } else if (startY < endY) {
            thirdY = endY - exlen;
        }
        else {
            thirdY = endY;
        }
        return 'M' + startX + ',' + startY + ' ' + 'L' + secondX + ',' + startY + ' ' +
            'L' + secondX + ',' + thirdY + ' ' + 'C' + secondX + ',' + endY + ' ' + secondX +
            ',' + endY + ' ' + fourthX + ',' + endY + ' ' + 'L' + endX + ',' + endY;
    },
    pathC: function (startX, startY, endX, endY, isLeft, elSpaceWidth) {
        let secondX, secondY, thirdX, thirdY;
        if (isLeft) {
            secondX = startX - elSpaceWidth * svg_ratios_2;
            thirdX = endX + elSpaceWidth * svg_ratios_1;
        } else {
            secondX = startX + elSpaceWidth * svg_ratios_1;
            thirdX = endX - elSpaceWidth * svg_ratios_2;
        }
        secondY = startY;
        thirdY = endY;
        return 'M' + startX + ',' + startY + ' C' + secondX + ',' + secondY + ' '
            + thirdX + ',' + thirdY + ' ' + endX + ',' + endY;
    },
    pathZType2: function (startX, startY, endX, endY, isUP) {
        let exlen = 8, secondY, fourthY, thirdX;
        if (!isUP) {
            secondY = startY + exlen;
            fourthY = startY + exlen * 2;
        } else {
            secondY = startY - exlen;
            fourthY = startY - exlen * 2;
        }
        if (startX > endX) {
            thirdX = endX + exlen;
        } else if (startX < endX) {
            thirdX = endX - exlen;
        }
        else {
            thirdX = endX;
        }
        return 'M' + startX + ',' + startY + ' ' + 'L' + startX + ',' + secondY + ' ' +
            'L' + thirdX + ',' + secondY + ' ' + 'C' + endX + ',' + secondY + ' ' + endX +
            ',' + secondY + ' ' + endX + ',' + fourthY + ' ' + 'L' + endX + ',' + endY;
    },
    pathCType2: function (startX, startY, endX, endY, isUP, elUPSpace) {
        let secondX, secondY, thirdX, thirdY;
        if (isUP) {
            secondY = startY - elUPSpace * svg_ratios_2;
            thirdY = endY + elUPSpace * svg_ratios_1;
        } else {
            secondY = startY + elUPSpace * svg_ratios_1;
            thirdY = endY - elUPSpace * svg_ratios_2;
        }
        secondX = startX;
        thirdX = endX;
        return 'M' + startX + ',' + startY + ' C' + secondX + ',' + secondY + ' '
            + thirdX + ',' + thirdY + ' ' + endX + ',' + endY;
    }
}