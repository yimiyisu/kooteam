<template>
    <div v-if="loaded">
        <Header :title="navTitle" :logo="logo"></Header>
        <Chapter class="book" v-if="article.type===4" :data="nav.sons"></Chapter>
        <Content v-else :tree="nav.sons" :isnav="showNav" :current="article._id" :data="article"></Content>
    </div>
</template>
<script>

    import Chapter from "./chapter"
    import Content from "./content"
    import Header from "./header"
    import Preview from "./preview"

    export default {
        components: {Header, Content, Chapter, Preview},
        props: ["logo"],
        data: function () {
            return {
                loaded: false,
                data: {},
                navTitle: "",
                nav: {sons: []},
                showNav: false,
                article: {}
            };
        },
        mounted: function () {
            let id = this.getId(), that = this;
            if (!id) {
                return;
            }
            this.loadData(id);
            this.$parent.$on("toggle", function (id) {
                that.toggle(id);
            });

            this.$parent.$on("load", function (val) {
                that.loadData(val);
                let url = "/view.html?id=" + val;
                that.showNav = false;
                history.pushState(null, null, url);
            });

            window.onpopstate = function () {
                let id = that.getId();
                that.loadData(id);
            }
        },
        methods: {
            loadData: function (id) {
                let that = this;
                if (!id) {
                    return;
                }
                let params = {_id: id};
                if (that.nav.sons && that.nav.sons.length > 0) {
                    params["only"] = true;
                }
                $.http(params, "/view/content.do", function (reback) {
                    if (reback.hasError) {
                        return alert(reback.message);
                    }
                    let data = reback.data;
                    that.article = data;

                    if (data.type === 4) {
                        that.nav = JSON.parse(data.content);
                        that.navTitle = data.title;
                    } else if (!that.nav.sons || that.nav.sons.length === 0) {
                        if (data.nav) {
                            that.nav = JSON.parse(data.nav);
                        }
                        that.navTitle = data.navTitle;
                    }
                    that.loaded = true;
                    let width = $(window).width();
                    if (width > 768) {
                        return;
                    }
                    that.$nextTick(function () {
                        $("img", ".container").el.forEach(function (item) {
                            let img = $(item);
                            let width = parseInt(img.width() / 2), height = parseInt(img.height() / 2);
                            img.attr({width: width, height: height});

                            // 增加预览事件
                            img.on("click", function (e) {
                                let target = $(e.currentTarget);
                                let width = target.width(), height = target.height();
                                $("#J_previewImg").css({
                                    "margin-left": (-width / 2) + "px",
                                    "margin-top": (-height / 2) + "px"
                                });
                                $.emit("imgPreview", target.attr("src"));
                            });
                        });
                    });
                });
            },
            toggle: function (id, data) {
                if (!data) {
                    data = this.nav.sons;
                }
                let item;
                for (let i = 0; i < data.length; i++) {
                    item = data[i];
                    if (item.id === id) {
                        item.status = !item.status;
                        return true;
                    }
                    if (item.sons && item.sons.length > 0) {
                        if (this.toggle(id, item.sons)) {
                            return true;
                        }
                    }
                }
                return false;
            },
            getId: function () {
                let link = location.search.substring(1);
                let pairs = link.split("&");
                for (let i = 0; i < pairs.length; i++) {
                    let pos = pairs[i].indexOf('=');
                    if (pos === -1) {
                        continue;
                    }
                    if (pairs[i].substring(0, pos) === "id") {
                        return pairs[i].substring(pos + 1);
                    }
                }
            }
        }
    }
</script>