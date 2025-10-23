package com.yimiyisu.kooteam.events.message.channels;

import com.yimiyisu.kooteam.events.message.IMessage;
import com.yimiyisu.kooteam.events.message.channels.domain.AttachDataSource;
import com.yimiyisu.kooteam.events.message.channels.domain.ChannelInfo;
import com.zen.domain.MessageDO;
import com.zen.domain.ZenUser;
import com.zen.kit.ConfigKit;
import com.zen.kit.PatternKit;
import com.zen.kit.StringKit;
import com.zen.kit.UserKit;
import jakarta.activation.DataHandler;
import jakarta.mail.*;
import jakarta.mail.internet.*;

import java.util.List;
import java.util.Properties;

public class EmailMessage implements IMessage {
    private static Session _session = null;

    private static IMessage instance = null;

    private EmailMessage() {

    }

    public static IMessage getInstance() {
        if (EmailMessage.instance == null) EmailMessage.instance = new EmailMessage();
        return EmailMessage.instance;
    }

    private Session getSession() {
        if (EmailMessage._session != null) return EmailMessage._session;
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

            if (user != null && StringKit.isNotEmpty(user.getEmail())) message.setHeader("Sender", user.getEmail());

            // 设置邮件主题
            message.setSubject(messageDO.getTitle());

            // 构建邮件内容
            MimeBodyPart htmlPart = new MimeBodyPart();
            htmlPart.setContent(messageDO.getContent(), "text/html; charset=utf-8");

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
//            String[] recievers = messageDO.getTo().split(",");
            List<String> recievers = messageDO.getRecievers();
            for (String reciever : recievers) {//验证收件人邮箱
                if (PatternKit.isEmail(reciever))
                    message.addRecipient(Message.RecipientType.TO, new InternetAddress(reciever));
                else {
                    user = UserKit.get(reciever);
                    if (user != null && StringKit.isNotEmpty(user.getEmail()))
                        message.addRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
                }
                // 发送邮件
                Transport.send(message);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
        return true;
    }

}
