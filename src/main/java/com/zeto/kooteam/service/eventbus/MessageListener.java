package com.zeto.kooteam.service.eventbus;

import com.aliyun.openservices.ons.api.Message;
import com.aliyun.openservices.ons.api.ONSFactory;
import com.aliyun.openservices.ons.api.Producer;
import com.aliyun.openservices.ons.api.PropertyKeyConst;
import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiMessageCorpconversationAsyncsendV2Request;
import com.dingtalk.api.response.OapiMessageCorpconversationAsyncsendV2Response;
import com.google.common.eventbus.Subscribe;
import com.taobao.api.ApiException;
import com.zeto.Zen;
import com.zeto.ZenData;
import com.zeto.ZenEnvironment;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenUser;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.service.domain.DingApp;
import com.zeto.kooteam.service.eventbus.model.MessageModel;

import java.util.Properties;

public class MessageListener {
    private Producer producer = null;
    private static final String topic = "bridge";
    private static final String tag = "kooteam";

    private static final String apiURL = "https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2";

    @Subscribe
    public void execute(MessageModel model) {
        ZenData data = ZenData.put("from", model.getFrom()).
                add("to", model.getTo()).
                add("content", model.getContent());
        // 保存消息记录
        Zen.getStorageEngine().execute("put/message", data, null);
        if (DingClient.isDD()) {
            dingTalk(model);
            return;
        }
        metaQ(data);
    }

    private void dingTalk(MessageModel messageModel) {
        ZenUser to = UserMapper.i().get(messageModel.getTo());
        DefaultDingTalkClient client = new DefaultDingTalkClient(apiURL);
        DingApp app = DingClient.info();

        OapiMessageCorpconversationAsyncsendV2Request request = new OapiMessageCorpconversationAsyncsendV2Request();
        request.setUseridList(to.getUnionId());

        request.setAgentId(app.getAgentId());
        request.setToAllUser(false);

        OapiMessageCorpconversationAsyncsendV2Request.Msg msg = new OapiMessageCorpconversationAsyncsendV2Request.Msg();
        msg.setOa(new OapiMessageCorpconversationAsyncsendV2Request.OA());
        OapiMessageCorpconversationAsyncsendV2Request.OA OA = msg.getOa();
        OA.setHead(new OapiMessageCorpconversationAsyncsendV2Request.Head());
        OA.getHead().setText("head");
        OA.setBody(new OapiMessageCorpconversationAsyncsendV2Request.Body());
        OA.getBody().setContent(messageModel.getContent());

        OA.setMessageUrl("");
        OA.setPcMessageUrl("//kooteam.com/todo/home.htm#xxxxxId");

        msg.setMsgtype("oa");
        request.setMsg(msg);

        try {
            OapiMessageCorpconversationAsyncsendV2Response response = client.execute(request, DingClient.getToken());
        } catch (ApiException e) {
            Zen.getLoggerEngine().exception(e);
        }
    }

    private void metaQ(ZenData data) {
        byte[] content = data.toJSON().getBytes();
        Message message = new Message();
        // 日常不发送metaq消息
        if (ZenEnvironment.isDaily()) {
            return;
        }
        message.setTopic(topic);
        message.setBody(content);
        message.setTag(tag);
        // 发送盘古消息，暂停-只支持模版消息
//        this.getProducer().sendOneway(message);
    }

    private Producer getProducer() {
        if (producer != null) {
            return producer;
        }
        Properties properties = new Properties();
        properties.put(PropertyKeyConst.AccessKey, ZenEnvironment.get("aliyunKey"));
        properties.put(PropertyKeyConst.SecretKey, ZenEnvironment.get("aliyunSecret"));
        if (ZenEnvironment.isDaily()) {
            properties.put(PropertyKeyConst.ProducerId, "PID-zen-test");
        } else {
            properties.put(PropertyKeyConst.ProducerId, "PID_bridge");
        }
        properties.setProperty(PropertyKeyConst.SendMsgTimeoutMillis, "3000");
        properties.put(PropertyKeyConst.ONSAddr, ZenEnvironment.get("ons"));
        Producer producer = ONSFactory.createProducer(properties);
        producer.start();
        return producer;
    }
}
