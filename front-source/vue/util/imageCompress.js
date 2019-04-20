export default {
    dealImage: function (obj, callback) {
        let reader = new FileReader();
        reader.onload = function (e) {
            try {
                let img = new Image();
                img.src = e.target.result;
                img.onerror = function () {
                    alert("非图片文件");
                };
                img.onload = function () {
                    // 按比例压缩
                    let imageQuality = 0.9,
                        newWidth, newHeight,
                        width = this.width, height = this.height,
                        maxHeight = 800, maxWidth = 800;

                    let ww = maxWidth / width,
                        hh = maxHeight / height;
                    let rate = (ww < hh) ? ww : hh;
                    if (rate < 1) {
                        newWidth = width * rate;
                        newHeight = height * rate;
                    } else {
                        newWidth = width.width;
                        newHeight = height.height;
                    }
                    let canvas = document.createElement('canvas'),          //生成canvas
                        ctx = canvas.getContext('2d'),
                        anw = document.createAttribute("width"),           // 创建属性节点
                        anh = document.createAttribute("height");
                    anw.nodeValue = newWidth;
                    anh.nodeValue = newHeight;
                    canvas.setAttributeNode(anw);
                    canvas.setAttributeNode(anh);
                    ctx.drawImage(this, 0, 0, newWidth, newHeight);
                    // 修改图像质量
                    let base64, size;
                    // 判断图片是否大于 1M,若大于1M，则降低图片质量
                    do {
                        base64 = canvas.toDataURL('image/jpeg', imageQuality);
                        size = base64.length / 1024 / 1024;
                        imageQuality -= 0.1;
                    } while (size > 1);
                    callback(base64);
                }
            } catch (e) {
                alert("图片格式不正确")
            }
        };
        reader.readAsDataURL(obj.files[0]);
    }
}