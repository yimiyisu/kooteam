<template>
    <div class="header">
        <h1>
            <span class="z-icon hover list" @click="toggle">&#xe241;</span>
            <span class="z-icon hover full" @click="full">&#xe3c2;</span>
            {{title}}
        </h1>
        <a href="//www.kooteam.com" target="_blank">
            <img :src="logo"/>
        </a>
    </div>
</template>
<script>
    export default {
        props: ["title", "logo"],
        data() {
            return {
                isFull: false
            }
        },
        mounted() {
            let that = this;
            // 监听快捷键全屏操作，并同步到内部状态里
            window.onresize = function () {
                let checkFull = document.isFullScreen || document.webkitIsFullScreen || document.mozIsFullScreen;
                if (checkFull) {
                    if (that.isFull) {
                        return;
                    }
                    $("body").addClass("full");
                    return that.isFull = true;
                }
                if (!that.isFull) {
                    return;
                }
                // 退出全屏
                $("body").removeClass("full");
                return that.isFull = false;
            }
        },
        methods: {
            toggle(e) {
                e.stopPropagation();
                this.$parent.showNav = !this.$parent.showNav;
            },
            home() {
                // window.location.href = "/view.html?id=" + this.parent;
            },
            full() {
                this.isFull = !this.isFull;
                if (this.isFull) {
                    let el = document.documentElement;
                    let rfs = el.requestFullScreen || el.webkitRequestFullScreen ||
                        el.mozRequestFullScreen || el.msRequestFullScreen;
                    if (rfs) { //typeof rfs != "undefined" && rfs
                        rfs.call(el);
                    } else if (typeof (window.ActiveXObject) !== "undefined") {
                        //for IE，这里其实就是模拟了按下键盘的F11，使浏览器全屏
                        let wscript = new ActiveXObject("WScript.Shell");
                        if (wscript != null) {
                            wscript.SendKeys("{F11}");
                        }
                    }
                    return $("body").addClass("full");
                }
                $("body").removeClass("full");
                let el = document;
                let cfs = el.cancelFullScreen || el.webkitCancelFullScreen ||
                    el.mozCancelFullScreen || el.exitFullScreen;
                if (cfs) { //typeof cfs != "undefined" && cfs
                    cfs.call(el);
                } else if (typeof (window.ActiveXObject) != "undefined") {
                    //for IE，这里和fullScreen相同，模拟按下F11键退出全屏
                    let wscript = new ActiveXObject("WScript.Shell");
                    if (wscript != null) {
                        wscript.SendKeys("{F11}");
                    }
                }
            }
        }
    }
</script>