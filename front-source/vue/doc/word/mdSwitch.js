import Config from "../../util/config"

export default function ($, Simditor, context) {
    let AttachButton, slice = [].slice;
    AttachButton = (function (superClass) {
        Config.extend(AttachButton, superClass);
        AttachButton.i18n = {
            'zh-CN': {
                attach: 'Markdown模式'
            },
            'en-US': {
                attach: 'Markdown Mode'
            }
        };

        AttachButton.prototype.name = 'markdown';
        AttachButton.prototype.icon = 'markdown';

        function AttachButton() {
            let args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            AttachButton.__super__.constructor.apply(this, args);
        }

        AttachButton.prototype.command = function (_this) {
            context.isMD = true;
            window.localStorage["editorMode"] = "md";
        };

        return AttachButton;

    })(Simditor.Button);
    Simditor.Toolbar.addButton(AttachButton);
    return AttachButton;
}
