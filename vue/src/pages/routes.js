import bookDemo from "../bookDemo/bookDemo.vue";
import content from "../editor/content.vue";
import detail from "../editor/detail/index.vue";
import editor from "../editor/index";
import home from "../home/home.vue";
import pages from "./index";
function register(pages) {
    let isExist;
    Object.keys(pages).forEach((pagePath) => {
        isExist = false;
        for (let index = 0; index < routes.length; index++) {
            const route = routes[index];
            if (route.path === "/" + pagePath) {
                isExist = true;
                break;
            }
        }
        if (!isExist) {
            routes.push({
                path: "/" + pagePath,
                component: pages[pagePath],
            });
        }
    });
}

let routes = [
    { path: "/", redirect: "/home" },
    {
        name: "_portal_",
        children: [
            { path: "/home", component: home },
            { path: "/bookDemo", component: bookDemo },
        ],
    },
    {
        name: "_editor_",
        children: [
            { path: "/editor", component: editor },
            { path: "/knowledge", component: detail },
            { path: "/knowledge/:id", component: content },
        ],
    },
    { path: "/welcome", redirect: "/task/my" },
];

register(pages);

export default routes;
