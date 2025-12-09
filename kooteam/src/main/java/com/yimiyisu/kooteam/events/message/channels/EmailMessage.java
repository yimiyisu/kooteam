package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.AttachDataSource;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.zen.domain.MessageDO;
import com.zen.domain.ZenUser;
import com.zen.kit.*;
import jakarta.activation.DataHandler;
import jakarta.mail.*;
import jakarta.mail.internet.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class EmailMessage implements IMessage {
    private static Session _session = null;

    private static IMessage instance = null;

    private EmailMessage() {

    }

    public static IMessage getInstance() {
        if (EmailMessage.instance == null)
            EmailMessage.instance = new EmailMessage();
        return EmailMessage.instance;
    }

    private Session getSession() {
        if (EmailMessage._session != null)
            return EmailMessage._session;
        Properties props = new Properties();
        props.put("mail.smtp.host", ConfigKit.get("mailHost"));
        props.put("mail.smtp.port", ConfigKit.get("mailPort"));
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.socketFactory.class", "javax.net.ssl.SSLSocketFactory");
        props.put("mail.smtp.starttls.enable", "true"); // 如果服务器支持TLS
        // 创建一个默认的MimeMessage对象
        Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
            @Override
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(ConfigKit.get("mailUser"), ConfigKit.get("mailPassword"));
            }
        });
        EmailMessage._session = session;
        return session;
    }

    @Override
    public boolean send(MessageDO messageDO, ChannelInfo channelInfo) {
        try {
            Session session = this.getSession();
            Message message = new MimeMessage(session);

            // 设置发件人
            String sender = ConfigKit.get("mailUser");
            ZenUser user = UserKit.get(messageDO.getFrom());
            message.setFrom(new InternetAddress(sender, messageDO.getTitle()));

            if (user != null && StringKit.isNotEmpty(user.getEmail()))
                message.setHeader("Sender", user.getEmail());

            // 设置邮件主题
            message.setSubject(messageDO.getTitle());
            String content = getMessageContent(messageDO.getContent(), channelInfo.getMessageType());
            content = StringKit.isEmpty(content) ? messageDO.getTitle() : content;
            MimeBodyPart htmlPart = new MimeBodyPart();
            htmlPart.setContent(content, "text/html; charset=utf-8");

            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(htmlPart);
            // 添加附件（如有）
            if (StringKit.isNotEmpty(messageDO.getLink())) {
                MimeBodyPart attachPart = new MimeBodyPart();
                AttachDataSource attachDataSource = new AttachDataSource(messageDO.getLink());

                attachPart.setDataHandler(new DataHandler(attachDataSource));
                attachPart.setFileName(MimeUtility.encodeText(messageDO.getLink()));

                multipart.addBodyPart(attachPart);
            }
            // 设置邮件内容
            message.setContent(multipart);
            List<String> recievers = messageDO.getRecievers() == null ? new ArrayList<>() : messageDO.getRecievers();
            // 验证收件人邮箱
            for (String reciever : recievers)
                if (PatternKit.isEmail(reciever))
                    message.addRecipient(Message.RecipientType.TO, new InternetAddress(reciever));
                else {
                    user = UserKit.get(reciever);
                    if (user != null && StringKit.isNotEmpty(user.getEmail()))
                        message.addRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
                }
            // 发送邮件
            Transport.send(message);
        } catch (Exception e) {
            System.out.println(e.getMessage());
            return false;
        }
        return true;
    }

    public String getMessageContent(String contentStr, String messageType) {
        String loginMode = ConfigKit.get("loginMode");
        if (StringKit.isEmpty(contentStr))
            return null;
        if (!judgeJson(contentStr)) return contentStr;
        Map<String, Object> contentMap = JsonKit.parseAsMap(contentStr);
        String content = switch (loginMode) {
            case "wework" -> weworkContent(contentMap, messageType);
            case "dingding" -> dingContent(contentMap, messageType);
            case "feishu" -> feishuContent(contentMap, messageType);
            default -> "";
        };
        return content;
    }

    private boolean judgeJson(String content) {
        try {
            JsonKit.parseAsMap(content);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // 获取钉钉消息主体内容
    private String dingContent(Map<String, Object> contentMap, String messageType) {
        if (StringKit.equals(messageType, "text")) return contentMap.get("content").toString();
        else if (StringKit.equals(messageType, "action_card") || StringKit.equals(messageType, "textcard"))
            return contentMap.get("markdown").toString();
        return null;
    }

    // 获取企业微信消息主体内容
    private String weworkContent(Map<String, Object> contentMap, String messageType) {
        if (StringKit.equals(messageType, "text")) return contentMap.get("content").toString();
        else if (StringKit.equals(messageType, "textcard")) return contentMap.get("description").toString();
        return null;
    }

    // 获取飞书消息主体内容
    private String feishuContent(Map<String, Object> contentMap, String messageType) {
        if (StringKit.equals(messageType, "text")) return contentMap.get("text").toString();
        else if (StringKit.equals(messageType, "interactive")) return JsonKit.stringify(contentMap);
        return null;
    }

}
