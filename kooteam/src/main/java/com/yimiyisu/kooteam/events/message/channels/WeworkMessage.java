package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.yimiyisu.kooteam.events.message.channels.domain.WeworkTextMessageDO;
import com.yimiyisu.kooteam.kit.OpenPlatformKit;
import com.yimiyisu.kooteam.kit.openPlatform.IOpenPlatform;
import com.yimiyisu.kooteam.kit.openPlatform.WeworkPlatform;
import com.zen.domain.MessageDO;
import com.zen.kit.ConfigKit;
import com.zen.kit.HttpKit;
import com.zen.kit.StringKit;

import java.util.HashMap;
import java.util.Map;

public class WeworkMessage implements IMessage {
    private final IOpenPlatform openPlatform = new WeworkPlatform();
    private final String url;
    //企业应用的ID
    private final String agentid;
    //保密消息，0表示可对外分享，1表示不能分享且内容显示水印，默认为0
    private final int safe;
    //表示是否开启id转译，0表示否，1表示是，默认0。
    private final int enableIdTrans;
    //是否开启重复消息检查，0表示否，1表示是，默认0
    private final int enableDuplicateCheck;
    //是否重复消息检查的时间间隔，默认1800s，最大不超过4小时
    private final int duplicateCheckInterval;

    private static IMessage instance = null;

    public static IMessage getInstance() {
        if (WeworkMessage.instance == null) WeworkMessage.instance = new WeworkMessage();
        return WeworkMessage.instance;
    }

    private WeworkMessage() {
        this.agentid = ConfigKit.get("weworkAppId");
        this.safe = 0;
        this.enableIdTrans = 0;
        this.enableDuplicateCheck = 0;
        this.duplicateCheckInterval = 1800;
        this.url = "https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=";
    }

    @Override
    public boolean send(MessageDO messageDO, ChannelInfo channelInfo) {
        String accessToken = openPlatform.getAccessToken();
        System.out.println(accessToken);
        Map<String, String> config = channelInfo.getConfig();
        Map<String, Object> body = new HashMap<>();
        body.put("msgtype", channelInfo.getMessageType());
        body.put("agentid", this.agentid);
        if (StringKit.isEmpty(messageDO.getTo())) return false;
        String userIds = OpenPlatformKit.getOpenId(messageDO, "|");
        body.put("touser", userIds);
        body.put("msgtype", "text");
        WeworkTextMessageDO.TextContent textContent = new WeworkTextMessageDO.TextContent();
        textContent.setContent(messageDO.getContent());
        body.put("text", textContent);
        if (!config.get("safe").isEmpty()) body.put("safe", config.get("safe"));
        else body.put("safe", this.safe);
        if (!config.get("enable_id_trans").isEmpty()) body.put("enable_id_trans", config.get("enable_id_trans"));
        else body.put("enable_id_trans", this.enableIdTrans);
        if (!config.get("enable_duplicate_check").isEmpty())
            body.put("enable_duplicate_check", config.get("enable_duplicate_check"));
        else body.put("enable_duplicate_check", this.enableDuplicateCheck);
        if (!config.get("duplicate_check_interval").isEmpty())
            body.put("duplicate_check_interval", config.get("duplicate_check_interval"));
        else body.put("duplicate_check_interval", this.duplicateCheckInterval);
        String url = this.url + accessToken;
        System.out.println(body);
        String response = HttpKit.post(url, body);
        System.out.println(response);
        return true;
    }

}
