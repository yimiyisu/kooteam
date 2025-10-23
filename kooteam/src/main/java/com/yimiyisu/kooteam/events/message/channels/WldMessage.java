package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.zen.domain.MessageDO;
import com.zen.kit.ConfigKit;
import com.zen.kit.HttpKit;
import com.zen.kit.JsonKit;
import com.zen.kit.StringKit;
import lombok.extern.slf4j.Slf4j;

import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

/**
 * 微联达短信发送
 */
@Slf4j
public class WldMessage implements IMessage {

    private static final String URL = "https://m.opapp.cn/sms-vs/api/sendSms";
    private static final String baseUrl = "https://icbc.opapp.cn/gh-js-activity/";
    private static WldMessage instance = null;
    private final String APPID;
    private final String SECRET;

    private WldMessage() {
        this.SECRET = ConfigKit.get("wldSMSSecret");
        this.APPID = ConfigKit.get("wldSMSAppId");
    }

    public static IMessage getInstance() {
        if (WldMessage.instance == null) WldMessage.instance = new WldMessage();
        return WldMessage.instance;
    }

    @Override
    public boolean send(MessageDO messageDO, ChannelInfo channelInfo) {
        String mobile = messageDO.getMobile();
        if (StringKit.isEmpty(mobile)) {
            return true;
        }
        Map<String, String> configMap = channelInfo.getConfig();
        if(configMap.get("prefix") == null || configMap.get("prefix").isEmpty())return true;
        String prefix = configMap.get("prefix");

        TreeMap<String, String> params = new TreeMap<>();
        params.put("appId", APPID);
        params.put("type", "1");
        params.put("phone", mobile);
        params.put("sendNotifyUrl", WldMessage.baseUrl + "sms/hl/notify");
        params.put("message", prefix + messageDO.getContent());
        params.put("linkid", messageDO.getMobile());
        String sign = sign(params);
        params.put("sign", sign);
        Map<String, Object> formData = new HashMap<>();
        params.keySet().forEach((key) -> formData.put(key, params.get(key)));
        String result = HttpKit.postAsForm(URL, formData);
        if (StringKit.isEmpty(result)) {
            return false;
        }
        Map<String, String> resultMap = JsonKit.parseAsStringMap(result);
        String resultData = resultMap.get("data");
        return "0".equals(resultData) || "00".equals(resultData);
    }

    private String sign(TreeMap<String, String> treeMap) {
        StringBuilder signStr = new StringBuilder();
        for (String key : treeMap.keySet()) signStr.append(treeMap.get(key));
        signStr = new StringBuilder(SECRET + signStr + SECRET);
        return StringKit.md5(signStr.toString());
    }
}
