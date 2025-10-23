package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.yimiyisu.kooteam.events.message.channels.domain.FeishuMessageDO;
import com.yimiyisu.kooteam.events.message.channels.domain.messageenum.FeishuMsgReceiveIdType;
import com.yimiyisu.kooteam.events.message.channels.domain.messageenum.FeishuMsgType;
import com.yimiyisu.kooteam.kit.openPlatform.FeishuPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.IOpenPlatform;
import com.zen.domain.MessageDO;
import com.zen.kit.HttpKit;
import com.zen.kit.JsonKit;

import java.util.HashMap;
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

    //todo未修改完
    @Override
    public boolean send(MessageDO messageDO, ChannelInfo channelInfo) {
        FeishuMessageDO feishuMessageDO = JsonKit.parse(channelInfo.getConfig(), FeishuMessageDO.class);
        String accessToken = openPlatform.getAccessToken();

        FeishuMessageDO feishuMessageDO1 = FeishuMessageDO.buildTextMessage(feishuMessageDO.getReceiveId(), messageDO.getContent(), feishuMessageDO.getUUID());
        System.out.println(feishuMessageDO1);

        String content = JsonKit.stringify(feishuMessageDO1.getContent());
        System.out.println(content);

        Map<String, String> head = new HashMap<>();
        head.put("Authorization", "Bearer " + accessToken);
        head.put("Content-Type", FeishuMessage.CONTENT_TUPE);
        Map<String, Object> body = new HashMap<>();
        //body.put(FeishuMsgReceiveIdType.USERID.getValue(),feishuMessageDO.getReceiveId());
        body.put(FeishuMsgReceiveIdType.USERID.getValue(), "26414a5g");
        body.put("msg_type", FeishuMsgType.TEXT);
        body.put("content", content);
        body.put("uuid", feishuMessageDO.getUUID());
        Map<String, Object> response = HttpKit.postAsMapWidthHeader(FeishuMessage.API_URL, body, head);
        System.out.println(response);
        return true;
    }
}
