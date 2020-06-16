package com.zeto.kooteam.service.auth;

import com.blade.ioc.annotation.Bean;
import com.blade.kit.EncryptKit;
import com.blade.kit.StringKit;
import com.google.common.base.Strings;
import com.zeto.ZenUserKit;
import com.zeto.domain.ZenUser;
import com.zeto.kit.ConfigKit;
import lombok.extern.slf4j.Slf4j;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.ldap.InitialLdapContext;
import java.util.Hashtable;

@Bean
@Slf4j
public class LADPService {

    // ldap 登录实例：https://www.jianshu.com/p/c5209713a69d
    // https://blog.csdn.net/aliaichidantong/article/details/80016449

    private static String LDAPURL = "";
    private static String BASEDN = "";

    public void init(String key) {
        LDAPURL = ConfigKit.getByApp(key, "ladpURL");
        BASEDN = ConfigKit.get(key, "baseDN");
        if (!Strings.isNullOrEmpty(BASEDN)) {
            LDAPURL += "/" + BASEDN;
        }
    }

    public ZenUser login(String userName, String passwd) {
        if (Strings.isNullOrEmpty(LDAPURL)) {
            return checkPwd(userName, passwd);
        }
        ZenUser user;
        Hashtable<String, String> env = new Hashtable<String, String>();
        if (Strings.isNullOrEmpty(BASEDN)) {
            env.put(Context.SECURITY_PRINCIPAL, userName);// 用户名
        } else {
            env.put(Context.SECURITY_PRINCIPAL, "cn=" + userName + "," + BASEDN);// 用户名
        }
        env.put(Context.SECURITY_CREDENTIALS, passwd);// 密码
        env.put(Context.PROVIDER_URL, LDAPURL);// 连接LDAP的URL和端口（这里的BASEDN你们可以不用，只要LDAPURL）
        env.put(Context.INITIAL_CONTEXT_FACTORY, "com.sun.jndi.ldap.LdapCtxFactory");// JNDI Context工厂类
        env.put(Context.SECURITY_AUTHENTICATION, "simple");// 认证类型

        try {
            new InitialLdapContext(env, null);// 开始连接
            user = ZenUserKit.getByName(userName);
            // 将用户同步到系统中
            if (user == null) {
                String uid = StringKit.objectId();
                user = new ZenUser();
                user.setUid(uid);
                user.setUsername(userName);
                user.setNick(userName);
                ZenUserKit.insert(user);
            }
        } catch (NamingException e) {
            user = checkPwd(userName, passwd);
        }
        return user;
    }

    private ZenUser checkPwd(String userName, String passwd) {
        ZenUser user = ZenUserKit.getByName(userName);
        if (user == null) {
            return null;
        }
        passwd = EncryptKit.md5(passwd);
        if (!passwd.equals(user.getPwd())) {
            return null;
        }
        return user;
    }

}
