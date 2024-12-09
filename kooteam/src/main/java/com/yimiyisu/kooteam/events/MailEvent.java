package com.yimiyisu.kooteam.events;

import com.yimiyisu.kooteam.events.model.MailEventModel;
import com.zen.domain.ZenUser;
import com.zen.interfaces.IEvent;
import com.zen.kit.ConfigKit;
import com.zen.kit.StringKit;
import com.zen.kit.UserKit;
import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import java.util.Properties;

public class MailEvent implements IEvent<MailEventModel> {
    private static Session _session = null;

    private Session getSession() {
        if (MailEvent._session != null) return MailEvent._session;
        Properties props = new Properties();
        props.put("mail.smtp.host", ConfigKit.get("mailHost"));
        props.put("mail.smtp.port", ConfigKit.get("mailPort"));
        props.put("mail.smtp.auth", "true");
        props.put("mail.smtp.starttls.enable", "true"); // 如果服务器支持TLS
        // 创建一个默认的MimeMessage对象
        Session session = Session.getInstance(props, new jakarta.mail.Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(ConfigKit.get("mailUser"), ConfigKit.get("mailPassword"));
            }
        });
        MailEvent._session = session;
        return session;
    }

    @Override
    public void execute(MailEventModel event) {
        try {
            Session session = this.getSession();
            Message message = new MimeMessage(session);

            String sender = ConfigKit.get("mailUser");
            ZenUser user = UserKit.get(event.getFrom());
            if (user != null && StringKit.isNotEmpty(user.getEmail())) sender = user.getEmail();
            // 设置发件人
            message.setFrom(new InternetAddress(sender));

            for (String uid : event.getTo()) {
                user = UserKit.get(uid);
                if (user != null && StringKit.isNotEmpty(user.getEmail()))
                    message.addRecipient(Message.RecipientType.TO, new InternetAddress(user.getEmail()));
            }

            // 设置邮件主题
            message.setSubject(event.getTitle());

            // 设置邮件正文
            message.setText(event.getContent());

            // 发送邮件
            Transport.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException(e);
        }
    }
}
