import Render from "./render.vue";
function copyVar(root) {
    const linkDom = document.createElement("link");
    linkDom.rel = "stylesheet";
    linkDom.href = `${zen.lib}.css`;
    root.appendChild(linkDom);
    const rootStyle = document.documentElement.getAttribute("style");
    const style = document.createElement("style");
    style.textContent = `.container.full .tool {top: 16px;left: 20px} .container {height: 260px;position: relative;cursor: pointer;background: var(--a-bg-color);} .tool {position: absolute;left: -25px;top: 0;z-index: 10;} :host {${rootStyle};--a-color-white: #ffffff;--a-color-black: #000000;--a-color-primary-rgb: 64, 158, 255;--a-color-success-rgb: 103, 194, 58;--a-color-warning-rgb: 230, 162, 60;--a-color-danger-rgb: 245, 108, 108;--a-color-error-rgb: 245, 108, 108;--a-color-info-rgb: 144, 147, 153;--a-font-size-extra-large: 20px;--a-font-size-large: 16px;--a-border-width: 1px;--a-border-style: solid;--a-font-size-medium: 14px;--a-font-size-base: 12px;--a-font-size-small: 12px;--a-font-size-extra-small: 12px;--a-font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', '微软雅黑', Arial, sans-serif;--a-font-weight-primary: 500;--a-font-line-height-primary: 24px;--a-index-normal: 1;--a-index-top: 1000;--a-index-popper: 2000;--a-border-radius-base: 4px;--a-border-radius-small: 2px;--a-border-radius-round: 20px;--a-border-radius-circle: 100%;--a-transition-duration: 0.3s;--a-transition-duration-fast: 0.2s;--a-transition-function-ease-in-out-bezier: cubic-bezier(0.645, 0.045, 0.355, 1);--a-transition-function-fast-bezier: cubic-bezier(0.23, 1, 0.32, 1);--a-component-size-large: 40px;--a-component-size: 32px;--a-component-size-small: 28px;}`;
    root.appendChild(style);
}
export default function (dom, inEditor) {
    const shadowRoot = dom.attachShadow({ mode: "closed" });
    const type = dom.dataset["type"];
    const id = dom.getAttribute("id");
    copyVar(shadowRoot);
    const mountPoint = document.createElement("div");
    function remove() {
        dom.remove();
    }
    zen.setup({
        com: (
            <Render
                type={type}
                inEditor={inEditor}
                onRemove={remove}
                value={id}
            />
        ),
        el: mountPoint,
    });
    shadowRoot.appendChild(mountPoint);
}
