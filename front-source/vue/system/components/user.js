export default {
    render() {
        let user = $.getUser();
        if (zen.mode > 1) {
            return <z-popup type="text" size="big" view="/my/info.xhtm">欢迎，{user.nick}!</z-popup>
        }
        return <div class="user-info">
            欢迎，{user.nick}!
            <ul>
                <li>
                    <z-popup type="text" size="big" view="/my/info.xhtm">个人中心</z-popup>
                </li>
                <li>
                    <z-wicket type="text" wicket-size="small" view="/my/space.jsx">切换空间</z-wicket>
                </li>
                <li>
                    <z-link type="text" href="https://www.kooteam.com/view.html?id=5e5893abc687557cc87e38c0"
                            target="_blank">帮助中心
                    </z-link>
                </li>
                <li>
                    <z-link type="text" href="https://www.kooteam.com/view.html?id=5e5893b9c687557cc87e38c3"
                            target="_blank">私有部署
                    </z-link>
                </li>
            </ul>
        </div>
    }
}