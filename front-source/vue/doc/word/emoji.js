import Config from "../../util/config"

export default function ($, Simditor) {
    var EmojiButton,
        slice = [].slice;

    EmojiButton = (function (superClass) {
        Config.extend(EmojiButton, superClass);

        EmojiButton.i18n = {
            'zh-CN': {
                emoji: '表情'
            },
            'en-US': {
                emoji: 'emoji'
            }
        };

        EmojiButton.images = ['smile.png', 'smiley.png', 'laughing.png', 'blush.png', 'heart_eyes.png', 'smirk.png', 'flushed.png', 'grin.png', 'wink.png', 'kissing_closed_eyes.png', 'stuck_out_tongue_winking_eye.png', 'stuck_out_tongue.png', 'sleeping.png', 'worried.png', 'expressionless.png', 'sweat_smile.png', 'cold_sweat.png', 'joy.png', 'sob.png', 'angry.png', 'mask.png', 'scream.png', 'sunglasses.png', 'heart.png', 'broken_heart.png', 'star.png', 'anger.png', 'exclamation.png', 'question.png', 'zzz.png', 'thumbsup.png', 'thumbsdown.png', 'ok_hand.png', 'punch.png', 'v.png', 'clap.png', 'muscle.png', 'pray.png', 'skull.png', 'trollface.png'];

        EmojiButton.prototype.name = 'emoji';

        EmojiButton.prototype.icon = 'smile-o';

        EmojiButton.prototype.menu = true;

        function EmojiButton() {
            let args;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            EmojiButton.__super__.constructor.apply(this, args);
            $.merge(this.editor.formatter._allowedAttributes['img'], ['data-emoji', 'alt']);
        }

        EmojiButton.prototype.renderMenu = function () {
            let $list, dir, html, i, len, name, opts, ref, src, tpl;
            tpl = '<ul class="emoji-list">\n</ul>';
            opts = $.extend({
                imagePath: 'images/emoji/',
                images: EmojiButton.images
            }, this.editor.opts.emoji || {});
            html = "";
            dir = opts.imagePath.replace(/\/$/, '') + '/';
            ref = opts.images;
            for (i = 0, len = ref.length; i < len; i++) {
                name = ref[i];
                src = "" + dir + name;
                name = name.split('.')[0];
                html += "<li data-name='" + name + "'><img src='" + src + "' width='20' height='20' alt='" + name + "' /></li>";
            }
            $list = $(tpl);
            $list.html(html).appendTo(this.menuWrapper);
            return $list.on('mousedown', 'li', (function (_this) {
                return function (e) {
                    var $img;
                    _this.wrapper.removeClass('menu-on');
                    if (!_this.editor.inputManager.focused) {
                        return;
                    }
                    $img = $(e.currentTarget).find('img').clone().attr({
                        'data-emoji': true,
                        'data-non-image': true
                    });
                    _this.editor.selection.insertNode($img);
                    _this.editor.trigger('valuechanged');
                    _this.editor.trigger('selectionchanged');
                    return false;
                };
            })(this));
        };

        EmojiButton.prototype.status = function () {
        };

        return EmojiButton;

    })(Simditor.Button);

    Simditor.Toolbar.addButton(EmojiButton);

    return EmojiButton;

}
