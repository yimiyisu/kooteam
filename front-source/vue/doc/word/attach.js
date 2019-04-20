import Config from "../../util/config"

export default function ($, Simditor) {
    let AttachButton, slice = [].slice;
    AttachButton = (function (superClass) {
        Config.extend(AttachButton, superClass);
        AttachButton.i18n = {
            'zh-CN': {
                attach: '上传附件'
            },
            'en-US': {
                attach: 'upload attach'
            }
        };

        AttachButton.prototype.name = 'attach';
        AttachButton.prototype.icon = 'upload';

        function AttachButton() {
            let args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            AttachButton.__super__.constructor.apply(this, args);
        }

        AttachButton.prototype.command = function (_this) {
            // _this.editor.selection.insertNode($img);
            // _this.editor.trigger('valuechanged');
            let dom = $("#J_uploadFile001"), fileDom = $("input", dom);
            dom.trigger("click");
            fileDom.change(function (e) {
                let formData, file = $(e.currentTarget);
                formData = new FormData();
                formData.append(file.fileKey, file.obj);
                formData.append("original_filename", file.name);


                $.ajax({
                    url: "",
                    data: formData,
                    processData: false,
                    contentType: false,
                    crossDomain: true,
                    type: 'POST',
                    headers: {
                        'X-File-Name': encodeURIComponent(file.name)
                    },
                    xhrFields: {
                        withCredentials: true
                    },
                    xhr: function () {
                        var req;
                        req = $.ajaxSettings.xhr();
                        if (req) {
                            req.upload.onprogress = (function (_this) {
                                return function (e) {
                                    return _this.progress(e);
                                };
                            })(this);
                        }
                        return req;
                    },
                    error: function (reback) {
                        console.log(reback);
                        debugger
                    }
                });
            });
        };

        return AttachButton;

    })(Simditor.Button);
    Simditor.Toolbar.addButton(AttachButton);
    return AttachButton;
}
