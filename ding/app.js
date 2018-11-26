import Util from "./utils/util.js"
import User from "./utils/user"
import Http from "./utils/http"

App({
    domain: "http://jabinfo.gicp.net",
    // domain: "https://www.kooteam.com",
    http: Http,
    user: User,
    util: Util,
    onShow: function (options) {
        this.queryData = options.query;
        this.init(options);
    },
    onLaunch: function (options) {
        // this.init(options);
    },
    onError(err) {
        dd.alert({content: JSON.stringify(err)});
    },
    init(options) {
        let query = options.query;
        if (!query || !query.checkId) {
            return;
        }
        this.checkId = query.checkId;
    },
    checkId: null,
    queryData: null
});