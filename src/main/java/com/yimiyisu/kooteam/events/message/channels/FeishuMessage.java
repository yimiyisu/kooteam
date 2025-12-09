package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.yimiyisu.kooteam.kit.openPlatform.FeishuPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.IOpenPlatform;
import com.zen.domain.MessageDO;
import com.zen.kit.HttpKit;
import com.zen.kit.StringKit;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FeishuMessage implements IMessage {
    private final IOpenPlatform openPlatform = new FeishuPlatform();
    private static final String API_URL = "https://open.feishu.cn/open-apis/im/v1/messages";
    private static final String CONTENT_TUPE = "application/json; charset=utf-8";
    private static IMessage instance = null;

    private FeishuMessage() {

    }

    public static IMessage getInstance() {
        if (FeishuMessage.instance == null) FeishuMessage.instance = new FeishuMessage();
        return FeishuMessage.instance;
    }

    // https://open.feishu.cn/document/server-docs/im-v1/batch_message/send-messages-in-batches#1b8abd5d
    @Override
    public boolean send(MessageDO messageDO, ChannelInfo channelInfo) {
        String url = "https://open.feishu.cn/open-apis/message/v4/batch_send/"; // 接口地址
        FeishuPlatform feishuPlatform = new FeishuPlatform();
        String token = feishuPlatform.getAccessToken();
        // 请求头
        Map<String, String> headers = new HashMap<>();
        headers.put("Authorization", "Bearer " + token);
        headers.put("Content-Type", "application/json; charset=utf-8");
        // 请求体
        Map<String, Object> body = new HashMap<>();
        String messageType = channelInfo.getMessageType();
        body.put("msg_type", messageType);
//        todo 由于登录，暂写死openid
        List<String> receive = new ArrayList<>();
        receive.add("ou_055cad2dd95d4464764201c871687210");
        body.put("open_ids", receive);
        if (StringKit.equals(messageType, "interactive")) { // 卡片消息
            body.put("card", messageDO.getContent());
        } else { // 文本消息
            body.put("content", messageDO.getContent());
        }

        System.out.println("body: " + body);

        String res = HttpKit.postWidthHeader(url, body, headers);
        System.out.println("res: " + res);
        return true;
    }
}
