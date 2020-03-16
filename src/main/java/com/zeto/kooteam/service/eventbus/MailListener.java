package com.zeto.kooteam.service.eventbus;

import com.blade.mvc.WebContext;
import com.google.common.base.Strings;
import com.google.common.eventbus.Subscribe;
import com.zeto.kit.ConfigKit;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.eventbus.model.MailMode;
import lombok.extern.slf4j.Slf4j;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.util.List;
import java.util.Properties;

@Slf4j
public class MailListener {
    private final static String host = "host";
    private final static String port = "port";
    private final static String user = "user";
    private final static String group = "mail";
    private final static String password = "password";
    private static String sendMail = null;
    private static Session session;

    private static Session init() {
        String pwd = ConfigKit.getByApp(group, password);
        sendMail = ConfigKit.getByApp(group, user);
        if (Strings.isNullOrEmpty(sendMail) || Strings.isNullOrEmpty(pwd)) {
            return null;
        }
        Authenticator authenticator = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(sendMail, pwd);
            }
        };
        String portStr = ConfigKit.getByApp(group, port);
        Properties properties = System.getProperties();
        properties.setProperty("mail.transport.protocol", "smtp");
        properties.setProperty("mail.smtp.host", ConfigKit.getByApp(group, host));
        properties.setProperty("mail.smtp.port", portStr);
        properties.put("mail.smtp.auth", "true");
        if (!portStr.equals("25")) {
            properties.put("mail.smtp.ssl.enable", "true");
        }
        session = Session.getInstance(properties, authenticator);
        return session;
    }

    @Subscribe
    public void execute(MailMode mailMode) {
        try {
            if (mailMode.isEmpty()) {
                return;
            }
            WebContext.create(mailMode.getSite());
            if (session == null) {
                session = init();
            }
            if (session == null) {
                return;
            }
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(sendMail));
            List<String> mails = mailMode.getTo();
            for (String to : mails) {
                message.addRecipient(Message.RecipientType.TO, new InternetAddress(to));
            }
            message.setSubject(mailMode.getTitle(), "utf-8");
            BodyPart messageBodyPart = new MimeBodyPart();
            messageBodyPart.setContent(mailMode.getContent(), "text/html;charset=utf-8");
            Multipart multipart = new MimeMultipart();
            multipart.addBodyPart(messageBodyPart);
            message.setContent(multipart);
            Transport.send(message);
        } catch (MessagingException mex) {
            log.error("mail fail", mex);
        } finally {
            WebContext.remove();
        }
    }

    // 邮件检测方法
    public static void test() {
        // 重新初始化配置
        init();
        MailMode mailMode = new MailMode();
        mailMode.addTo(ConfigKit.getByApp(group, user));
        mailMode.setTitle("kooteam邮件绑定配置测试");
        mailMode.setContent("恭喜你，邮件账号配置成功！");
        EventBiz.sendMail(mailMode);
    }
}
