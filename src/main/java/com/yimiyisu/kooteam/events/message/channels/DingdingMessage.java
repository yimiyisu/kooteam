package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.yimiyisu.kooteam.events.message.domain.MessageResultDO;
import com.yimiyisu.kooteam.kit.openPlatform.DingdingPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.IOpenPlatform;
import com.zen.domain.MessageDO;
import com.zen.kit.ConfigKit;
import com.zen.kit.HttpKit;
import com.zen.kit.JsonKit;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class DingdingMessage implements IMessage {
    private final IOpenPlatform openPlatform = new DingdingPlatform();
    private final String agentId;
    private static IMessage instance = null;

    public static IMessage getInstance() {
        if (DingdingMessage.instance == null) DingdingMessage.instance = new DingdingMessage();
        return DingdingMessage.instance;
    }

    private DingdingMessage() {
        this.agentId = ConfigKit.get("dingAgentId");
    }

    @Override
    public boolean send(MessageDO messageDO, ChannelInfo channelInfo) {
        String accessToken = openPlatform.getAccessToken();
        Map<String, Object> body = new HashMap<>();
        //钉钉应用的ID
        body.put("agent_id", this.agentId);
        List<String> userIds = new ArrayList<>();
        userIds.add("3564075531954999");
        body.put("userid_list", JsonKit.stringify(userIds));

        // todo 钉钉无法登录，userIds先写死
//        if (messageDO.getTo().isEmpty()) body.put("to_all_user", true);
//        else {
//            String userIds = OpenPlatformKit.getOpenId(messageDO, ",");
//            body.put("userid_list", userIds);
//        }

        // 设置消息内容
        String messageType = channelInfo.getMessageType();
        Map<String, Object> content = JsonKit.parseAsMap(messageDO.getContent());
        body.put(messageType, content);

        String url = "https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2?access_token=" + accessToken;
        String response = HttpKit.post(url, body);
        System.out.println(response);
        MessageResultDO messageResultDO = JsonKit.parse(response, MessageResultDO.class);
        getsendresult(messageResultDO.getTask_id());
        return true;
    }

    //撤回工作通知消息
    public MessageResultDO recall(String taskId) {
        String accessToken = openPlatform.getAccessToken();
        System.out.println(accessToken);
        Map<String, Object> body = new HashMap<>();
        body.put("agent_id", this.agentId);
        body.put("msg_task_id", taskId);

        String url = "https://oapi.dingtalk.com/topapi/message/corpconversation/recall?access_token=" + accessToken;
        String response = HttpKit.post(url, body);
        System.out.println(response);
        return JsonKit.parse(response, MessageResultDO.class);
    }

    //查看消息发送结果
    public MessageResultDO getsendresult(String taskId) {
        String accessToken = openPlatform.getAccessToken();
        Map<String, Object> body = new HashMap<>();
        body.put("agent_id", this.agentId);
        body.put("task_id", taskId);

        String url = "https://oapi.dingtalk.com/topapi/message/corpconversation/getsendresult?access_token=" + accessToken;
        String response = HttpKit.post(url, body);
        System.out.println(response);
        return JsonKit.parse(response, MessageResultDO.class);
    }
}
