package com.zeto.kooteam.service.eventbus;

import com.blade.kit.GsonKit;
import com.blade.kit.PatternKit;
import com.google.common.base.Strings;
import com.google.common.eventbus.Subscribe;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.ZenUserHelper;
import com.zeto.domain.ZenUser;
import com.zeto.kooteam.service.EventBiz;
import com.zeto.kooteam.service.eventbus.model.MailMode;
import com.zeto.kooteam.util.Email;
import lombok.extern.slf4j.Slf4j;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import java.util.List;
import java.util.Map;
import java.util.Properties;

@Slf4j
public class MailListener {
    private final static String host = "mailHost";
    private final static String port = "mailPort";
    private final static String user = "mailUser";
    private final static String password = "mailPassword";
    private static Session session;


    private static Session init() {
        String username = ZenEnvironment.get(user),
                pwd = ZenEnvironment.get(password);
        if (Strings.isNullOrEmpty(username) || Strings.isNullOrEmpty(pwd)) {
            return null;
        }
        Authenticator authenticator = new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(username, pwd);
            }
        };
        String portStr = ZenEnvironment.get(port);
        Properties properties = System.getProperties();
        properties.setProperty("mail.transport.protocol", "smtp");
        properties.setProperty("mail.smtp.host", ZenEnvironment.get(host));
        properties.setProperty("mail.smtp.port", portStr);
        properties.put("mail.smtp.auth", "true");
        if (!portStr.equals("25")) {
            properties.put("mail.smtp.ssl.enable", "true");
        }
        return Session.getInstance(properties, authenticator);
    }

    @Subscribe
    public void execute(MailMode mailMode) {
        try {
            if (session == null) {
                session = init();
            }
            if (session == null) {
                log.error("请到系统设置里，配置邮件服务器信息", new Exception("邮件服务器配置错误，邮件发送失败"));
                return;
            }
            MimeMessage message = new MimeMessage(session);
            message.setFrom(new InternetAddress(ZenEnvironment.get(user)));
            mailMode = parse(mailMode);
            if (mailMode == null || mailMode.isEmptyTo()) {
                return;
            }
            for (String to : mailMode.getTo()) {
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
        }
    }

    public static MailMode parse(MailMode mailMode) {
        if (mailMode.getData() == null) {
            return mailMode;
        }
        ZenResult data = mailMode.getData();
        // 邮件已发送过
        if (data.get("status").equals("1")) {
            return null;
        }
        mailMode.setTitle(data.get("title"));
        String content = data.get("content"), mails = data.get("mails"), readers = data.get("readers");
        mailMode.setContent(Email.getTemplate(content));
        if (!Strings.isNullOrEmpty(mails)) {
            String[] mailList = mails.split(",");
            for (String mail : mailList) {
                if (PatternKit.isEmail(mail)) {
                    mailMode.addTo(mail);
                }
            }
        }
        List<Map<String, Object>> readerList = GsonKit.parseListMap(readers);
        if (readerList != null) {
            for (Map<String, Object> item : readerList) {
                ZenUser user = ZenUserHelper.i().get(item.get("_id").toString());
                if (user != null && PatternKit.isEmail(user.getEmail())) {
                    mailMode.addTo(user.getEmail());
                }
            }
        }
        return mailMode;
    }

    // 邮件检测方法
    public static void test() {
        // 重新初始化配置
        init();
        MailMode mailMode = new MailMode();
        mailMode.addTo(ZenEnvironment.get(user));
        mailMode.setTitle("kooteam邮件绑定配置测试");
        mailMode.setContent("恭喜你，邮件账号配置成功！");
        EventBiz.sendMail(mailMode);
    }
}
