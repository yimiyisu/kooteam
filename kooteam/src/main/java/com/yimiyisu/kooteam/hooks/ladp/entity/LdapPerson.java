package com.yimiyisu.kooteam.hooks.ladp.entity;

import com.yimiyisu.kooteam.hooks.ladp.utils.PasswordUtils;
import com.zen.kit.StringKit;
import lombok.Getter;
import lombok.ToString;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.*;
import java.nio.charset.StandardCharsets;

/**
 * Ldap 人员节点
 *
 * @author noear
 * @since 1.0
 */
@Getter
@ToString
public class LdapPerson implements LdapEntry {
    /**
     * distinguished Name
     */
    private String dn;

    /**
     * user id
     */
    private String uid;
    /**
     * user id number
     */
    private String uidNumber;

    /**
     * 分组ID数字号码
     */
    private String gidNumber;

    /**
     * common name
     */
    private String cn;
    /**
     * user password，用户密码
     */
    private String userPassword;

    /**
     * surname，姓
     */
    private String sn;
    /**
     * givenName，名字
     */
    private String givenName;
    /**
     * display name，显示名
     */
    private String displayName;
    /**
     * title
     */
    private String title;
    /**
     * description
     */
    private String description;
    /**
     * mail
     */
    private String mail;

    /**
     * telephone number
     */
    private String mobile;

    /**
     * telephone number
     */
    private String telephoneNumber;

    /**
     * ou
     */
    private String ou;


    private Attributes attributes;

    @Override
    public Attributes getAttributes() {
        if (attributes == null) attributes = new BasicAttributes();

        return attributes;
    }

    public String getAttr(String name) throws NamingException {
        if (getAttributes() == null) return null;

        Attribute attr = getAttributes().get(name);
        if (attr == null) return null;

        return attr.get().toString();
    }

    /**
     * 准备
     */
    public void prepare() {
        if (getAttributes().get("objectClass") == null) {
            Attribute objectClass = new BasicAttribute("objectClass");
            objectClass.add("inetOrgPerson");
            objectClass.add("posixAccount");
            objectClass.add("top");
            getAttributes().put(objectClass);
        }
    }

    public void setUserPassword(String userPasswordNew) {
        this.userPassword = userPasswordNew;
        String userPasswordNew2 = PasswordUtils.buildMd5Password(userPasswordNew);
        getAttributes().put("userPassword", userPasswordNew2.getBytes(StandardCharsets.UTF_8));
    }


    public void setUid(String val) {
        this.uid = val;
        getAttributes().put("uid", val);
    }

    public void setUidNumber(String val) {
        this.uidNumber = val;
        getAttributes().put("uidNumber", val);
    }


    public void setGidNumber(String val) {
        this.gidNumber = val;
        getAttributes().put("gidNumber", val);
    }

    public void setCn(String val) {
        this.cn = val;
        getAttributes().put("cn", val);
        getAttributes().put("homeDirectory", "/home/users/" + val);

        if (getAttributes().get("sn") == null) setSn(val);

        if (getAttributes().get("uid") == null) setUid(val);

        if (getAttributes().get("uidNumber") == null) setUidNumber(String.valueOf(System.currentTimeMillis()));
    }

    public void setSn(String val) {
        this.sn = val;
        getAttributes().put("sn", val);
    }

    public void setGivenName(String val) {
        this.givenName = val;
        getAttributes().put("givenName", val);
    }

    public void setDisplayName(String val) {
        this.displayName = val;
        getAttributes().put("displayName", val);
    }

    public void setTitle(String val) {
        this.title = val;
        getAttributes().put("title", val);
    }

    public void setDescription(String val) {
        this.description = val;
        getAttributes().put("description", val);
    }

    public void setMail(String val) {
        this.mail = val;
        getAttributes().put("mail", val);
    }

    public void setTelephoneNumber(String val) {
        this.telephoneNumber = telephoneNumber;
        getAttributes().put("telephoneNumber", val);
    }

    public void setMobile(String val) {
        this.mobile = val;
        getAttributes().put("mobile", val);
    }

    public void setOu(String ou) {
        this.ou = ou;
        getAttributes().put("ou", ou);
    }

    @Override
    public void bind(SearchResult result) throws NamingException {
        try {
            this.dn = result.getNameInNamespace();
        } catch (UnsupportedOperationException e) {
            this.dn = result.getName();
        }
        this.attributes = result.getAttributes();

        NamingEnumeration<String> keys = getAttributes().getIDs();

        while (keys.hasMore()) {
            String key = keys.next();
            Attribute val = getAttributes().get(key);

            if ("uid".equals(key)) this.uid = (val.get().toString());
            else if ("uidNumber".equals(key)) this.uidNumber = (val.get().toString());
            else if ("gidNumber".equals(key)) this.gidNumber = (val.get().toString());
            else if ("cn".equals(key)) this.cn = (val.get().toString());
            else if ("userPassword".equals(key)) this.userPassword = (new String((byte[]) val.get()));
            else if ("sn".equals(key)) this.sn = (val.get().toString());
            else if ("givenName".equals(key)) this.givenName = (val.get().toString());
            else if ("displayName".equals(key)) this.displayName = (val.get().toString());
            else if ("title".equals(key)) this.title = (val.get().toString());
            else if ("description".equals(key)) this.description = (val.get().toString());
            else if ("mail".equals(key)) this.mail = (val.get().toString());
            else if ("telephoneNumber".equals(key)) this.telephoneNumber = (val.get().toString());
            else if ("mobile".equals(key)) this.mobile = (val.get().toString());
            else if ("ou".equals(key)) this.ou = (val.get().toString());
        }
    }

    /**
     * 验证密码
     */
    public boolean verifyPassword(String userPassword) {
        if (StringKit.isEmpty(userPassword)) throw new IllegalArgumentException("userPassword");

        String orgPassword = userPassword;

        if (this.userPassword != null) {
            if (this.userPassword.equals(orgPassword)) return true;

            if (this.userPassword.equals(PasswordUtils.buildMd5Password(orgPassword))) return true;
        }

        return false;
    }

    /**
     * 在一个组里
     */
    public boolean inGroup(LdapGroup group) {
        if (group == null) return false;

        //基于dn校验
        if (dn != null) if (dn.contains("cn=" + group.getCn())) return true;

        //基于组成员校验
        return group.hahMember(this.cn);
    }
}
