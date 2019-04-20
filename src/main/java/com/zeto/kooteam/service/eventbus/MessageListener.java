package com.zeto.kooteam.service.eventbus;


import com.dingtalk.api.DefaultDingTalkClient;
import com.dingtalk.api.request.OapiMessageCorpconversationAsyncsendV2Request;
import com.dingtalk.api.response.OapiMessageCorpconversationAsyncsendV2Response;
import com.google.common.eventbus.Subscribe;
import com.taobao.api.ApiException;
import com.zeto.Zen;
import com.zeto.ZenData;
import com.zeto.ZenUserKit;
import com.zeto.domain.ZenUser;
import com.zeto.kooteam.dingtalk.DingClient;
import com.zeto.kooteam.service.domain.DingApp;
import com.zeto.kooteam.service.eventbus.model.MessageModel;
import lombok.extern.slf4j.Slf4j;


@Slf4j
public class MessageListener {
    private static final String topic = "bridge";
    private static final String tag = "kooteam";

    private static final String apiURL = "https://oapi.dingtalk.com/topapi/message/corpconversation/asyncsend_v2";

    @Subscribe
    public void execute(MessageModel model) {
        ZenData data = ZenData.put("from", model.getFrom()).
                set("to", model.getTo()).
                set("content", model.getContent());
        // 保存消息记录
        Zen.getStorageEngine().execute("put/message", data, null);
        // 发送钉钉消息
        if (DingClient.isInited()) {
            dingTalk(model);
            return;
        }


    }

    private void dingTalk(MessageModel messageModel) {
        ZenUser to = ZenUserKit.get(messageModel.getTo());
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
//        OA.setPcMessageUrl("//kooteam.com/todo/home.htm#xxxxxId");

        msg.setMsgtype("oa");
        request.setMsg(msg);

        try {
            OapiMessageCorpconversationAsyncsendV2Response response = client.execute(request, DingClient.getToken());
        } catch (ApiException e) {
            log.error("", e);
        }
    }

    private void wechat() {

    }

}
