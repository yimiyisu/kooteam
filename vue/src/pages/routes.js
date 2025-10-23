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
    // { path: "/", redirect: "/system/stat" },
    // { path: "/welcome", redirect: "/system/stat" },
    { path: "/", redirect: "/task/my" },
    { path: "/welcome", redirect: "/task/my" },
    {
        name: "_portal_",
        children: [{ path: "/home", component: home }],
    },
    {
        name: "_editor_",
        children: [
            { path: "/editor", component: editor },
            // { path: "/knowledge", component: detail },
            // { path: "/knowledge/:id", component: content },
        ],
    },
];

register(pages);

export default routes;
