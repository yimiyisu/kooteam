// <!--li>
// <z-link type="text" href="https://www.kooteam.com/view.html?id=5e5893abc687557cc87e38c0"
//         target="_blank">帮助中心
// </z-link>
// </li-->
export default {
    data() {
        return {
            isUpdated: false
        }
    },
    async created() {
        if (zen.mode < 2) {
            return;
        }
        this.isUpdated = await $.get(null, "/zeto/checkUpdate.do");
    },
    render() {
        let user = $.getUser(), isCloud = zen.mode < 2;
        return <div class="user-info">
            欢迎，{user.nick}!
            <ul>
                <li>
                    <z-popup type="text" size="big" view="/my/info.xhtm">个人中心</z-popup>
                </li>
                {this.isUpdated && <li>
                    <z-wicket type="text" title="Kooteam新版本已经发布" wicket-size="small" view="/my/update.jsx">
                        <span class="ft red">新版本!</span>
                    </z-wicket>
                </li>}
                {isCloud && <li>
                    <z-wicket type="text" wicket-size="small" view="/my/space.jsx">切换空间</z-wicket>
                </li>}
                {isCloud && <li>
                    <z-link type="text" href="https://www.kooteam.com/view.html?id=5e5893b9c687557cc87e38c3"
                            target="_blank">私有部署
                    </z-link>
                </li>}
            </ul>
        </div>
    }
}