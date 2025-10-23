package com.yimiyisu.kooteam.events.message.channels.domain;



import lombok.Data;

import java.util.List;

@Data
public class DingdingMessageDO {
    //发送消息时使用的微应用的AgentID。
    private Long agentId;
    //接收者的userid列表，最大用户列表长度100。
    private List<String> useridList;
    //接收者的部门id列表，最大列表长度20。
    //接收者是部门ID时，包括子部门下的所有用户。
    private List<String> deptIdList;
    //是否发送给企业全部用户。
    private Boolean toAllUser;
    //消息内容，最长不超过2048个字节，支持以下工作通知类型：文本消息、图片消息、语音消息、文件消息、链接消息、OA消息、Markdown消息、卡片消息
    private Msg msg;

    public String getUseridList() {
        if (useridList != null&&!useridList.isEmpty()){
            return String.join(",", useridList);
        }
        return null;
    }

    public String getDeptIdList() {
        if (deptIdList != null&&deptIdList.isEmpty()){
            return String.join(",", deptIdList);
        }
        return null;
    }

    @Data
    public static class Msg {
        //消息类型
        private String msgtype;
        private TextContent text;
        private ImageContent image;
        private VoiceContent voice;
        private FileContent file;
        private LinkContent link;
        private OAContent oa;
        private MarkdownContent markdown;
        private ActionCardContent action_card;
    }

    // 所有消息内容类的定义
    //文本消息
    @Data
    public static class TextContent {
        private String content;
    }

    //图片消息
    @Data
    public static class ImageContent {
        //媒体文件mediaid，建议宽600像素 x 400像素，宽高比3 : 2。
        private String mediaId;
    }

    //语音消息
    @Data
    public static class VoiceContent {
        //媒体文件ID。调用上传媒体文件接口获取mediaId参数值。
        private String mediaId;
        //正整数，小于60，表示音频时长。
        private String duration;
    }

    //文件消息
    @Data
    public static class FileContent {
        //媒体文件ID，引用的媒体文件最大10MB。
        private String mediaId;
    }

    //链接消息
    @Data
    public static class LinkContent {
        //100字符以内
        private String title;
        //500字符以内
        private String text;
        //消息点击链接地址，当发送消息为小程序时支持小程序跳转链接。
        private String messageUrl;
        //调用上传媒体文件接口获取。
        private String picUrl;
    }

    //OA消息
    @Data
    public static class OAContent {
        private OAHead head;
        private OABody body;
        //消息点击链接地址，当发送消息为小程序时支持小程序跳转链接。
        private String messageUrl;
        //PC端点击消息时跳转到的地址。
        private String pcMessageUrl;
        //消息状态栏，只支持接收者的userid列表，userid最多不能超过5个人。
        private StatusBar statusBar;

        @Data
        public static class OAHead {
            //如果是发送工作通知消息，该参数会被替换为当前应用名称。
            //如果是发送消息到企业群或者发送普通消息，该参数有效，长度限制为最多10个字符。
            private String text;
            //消息头部的背景颜色。长度限制为8个英文字符，其中前2为表示透明度，后6位表示颜色值。不要添加0x。
            private String bgcolor;
        }

        @Data
        public static class OABody {
            //消息体的标题，建议50个字符以内。
            private String title;
            //消息体的内容，最多显示3行。
            private String content;
            //自定义的作者名字。
            private String author;
            //消息体中的图片，支持图片资源@mediaId。建议宽600像素 x 400像素，宽高比3 : 2。
            //调用上传媒体文件接口获取
            private String image;
            //自定义的附件数目。此数字仅供显示，钉钉不作验证。
            private String fileCount;
            //消息体的表单，最多显示6个，超过会被隐藏。
            private Form form;
            //单行富文本信息。
            private Rich rich;

            @Data
            public static class Form {
                private String key;
                private String value;
            }

            @Data
            public static class Rich {
                //单行富文本信息的数目。
                private String num;
                //单行富文本信息的单位。
                private String unit;
            }
        }

        @Data
        public static class StatusBar {
            //状态栏文案。
            private String statusValue;
            //状态栏背景色，默认为黑色，推荐0xFF加六位颜色值。
            private String statusBg;
        }
    }

    //markdown消息
    @Data
    public static class MarkdownContent {
        //首屏会话透出的展示内容。
        private String title;
        //markdown格式的消息，最大不超过5000字符。
        private String text;
    }

    //卡片消息
    @Data
    public static class ActionCardContent {
        //透出到会话列表和通知的文案。
        private String title;
        //消息内容，支持markdown，语法参考标准markdown语法。建议1000个字符以内。
        private String markdown;
        //使用整体跳转ActionCard样式时的标题。必须与single_url同时设置，最长20个字符。
        private String singleTitle;
        //消息点击链接地址，当发送消息为小程序时支持小程序跳转链接，最长500个字符。
        //调用上传媒体文件接口获取
        private String singleUrl;
        //使用独立跳转ActionCard样式时的按钮排列方式：0：竖直排列 1：横向排列
        //必须与btn_json_list同时设置。
        private String btnOrientation;
        //使用独立跳转ActionCard样式时的按钮列表；必须与btn_orientation同时设置，且长度不超过1000字符。
        private List<Button> btnJsonList;

        @Data
        public static class Button {
            //使用独立跳转ActionCard样式时的按钮的标题，最长20个字符。
            private String title;
            //使用独立跳转ActionCard样式时的跳转链接，最长700个字符。
            private String actionUrl;
        }
    }
}
