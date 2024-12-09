package com.yimiyisu.kooteam.hooks.ladp;

import com.yimiyisu.kooteam.hooks.ladp.exception.IllegalConfigException;
import com.zen.kit.ConfigKit;
import com.zen.kit.StringKit;
import lombok.Getter;

import javax.naming.Context;
import javax.naming.NamingException;
import javax.naming.ldap.InitialLdapContext;
import javax.naming.ldap.LdapContext;
import java.util.Hashtable;

/**
 * Ldap 客户端
 *
 * @author noear
 * @since 1.0
 */
public class LdapClient {
    private final Hashtable config;
    @Getter
    private String baseDn;
    @Getter
    private String userFilter;
    @Getter
    private String groupFilter;

    public void setBaseDn(String baseDn) {
        if (StringKit.isNotEmpty(baseDn)) this.baseDn = baseDn;
    }

    public void setUserFilter(String userFilter) {
        if (StringKit.isNotEmpty(userFilter)) this.userFilter = userFilter;
    }

    public void setGroupFilter(String groupFilter) {
        if (StringKit.isNotEmpty(groupFilter)) this.groupFilter = groupFilter;
    }

    public LdapClient() {
        String url = ConfigKit.get("ldapUrl");
        String bindDn = ConfigKit.get("ldapBindDn");
        String paasword = ConfigKit.get("ldapPassword");
        setBaseDn(ConfigKit.get("ldapBaseDn"));
        setUserFilter(ConfigKit.get("ldapUserFilter"));
        setGroupFilter(ConfigKit.get("ldapGroupFilter"));

        config = buildConfig(url, bindDn, paasword);
    }

    /**
     * 构建配置
     */
    private Hashtable buildConfig(String url, String bindDn, String paasword) {
        if (StringKit.isEmpty(baseDn)) throw new IllegalConfigException("baseDn");


        if (StringKit.isEmpty(url)) throw new IllegalConfigException("url");

        if (StringKit.isEmpty(bindDn)) throw new IllegalConfigException("bindDn");

        if (StringKit.isEmpty(paasword)) throw new IllegalConfigException("paasword");

        String factory = "com.sun.jndi.ldap.LdapCtxFactory";
        String type = "simple"; // "none","simple","strong"

        Hashtable<String, String> env = new Hashtable<>();
        env.put(Context.INITIAL_CONTEXT_FACTORY, factory);
        env.put(Context.PROVIDER_URL, url);
        env.put(Context.SECURITY_AUTHENTICATION, type);
        env.put(Context.SECURITY_PRINCIPAL, bindDn);
        env.put(Context.SECURITY_CREDENTIALS, paasword);

        return env;
    }

    /**
     * 打开一个会话
     */
    public LdapSession open() throws NamingException {
        LdapContext context = new InitialLdapContext(config, null);
        return new LdapSessionDefault(this, context);
    }
}
