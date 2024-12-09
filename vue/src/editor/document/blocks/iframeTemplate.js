const docs = { 3: "mindmap", 4: "flow", 5: "xspreadsheet", 6: "excalidraw" };

export default function (type, id, readonly = false) {
    const file = docs[type];
    if (!file) {
        return "";
    }
    const { res, lib, host } = window.zen;
    let pluginJS = zen.path(`lib/${file}.js`);
    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="chrome,IE=edge" />
  <meta name="HandheldFriendly" content="true" />
  <meta name="format-detection" content="telephone=no,email=no" />
  <meta name="viewport"
    content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0, user-scalable=no, minimal-ui, viewport-fit=cover" />
  <meta name="renderer" content="webkit" />
  <meta name="msapplication-tap-highlight" content="no" />
  <title>yimiyisu</title>
  <script src="${lib}.js"></script>
  <link rel="stylesheet" type="text/css" href="${lib}.css">
<body data-id="${id}" res-path="${res}">
<script>zen.host = '${host || ""}';var _rd_=${readonly};</script>
<div id="root"></div>
<script src="${pluginJS}"></script></body>
</html>`;
}
