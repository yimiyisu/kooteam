package com.yimiyisu.kooteam.hooks.ladp.entity;

import lombok.Getter;
import lombok.ToString;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attribute;
import javax.naming.directory.Attributes;
import javax.naming.directory.SearchResult;
import java.util.Collections;
import java.util.List;

/**
 * Ldap 分组节点
 *
 * @author noear
 * @since 1.0
 */
@Getter
@ToString
public class LdapGroup implements LdapEntry {
    private String dn;
    private String cn;
    private String ou;

    private String gidNumber;
    private List<String> memberUid;

    private Attributes attributes;

    public String getAttr(String name) throws NamingException {
        if (getAttributes() == null) return null;

        Attribute attr = getAttributes().get(name);
        if (attr == null) return null;

        return attr.get().toString();
    }

    @Override
    public void bind(SearchResult result) throws NamingException {
        try {
            this.dn = result.getNameInNamespace();
        } catch (UnsupportedOperationException e) {
            this.dn = result.getName();
        }

        this.attributes = result.getAttributes();

        NamingEnumeration<String> keys = attributes.getIDs();

        while (keys.hasMore()) {
            String key = keys.next();
            Attribute val = attributes.get(key);

            if ("cn".equals(key)) this.cn = (val.get().toString());
            else if ("ou".equals(key)) this.ou = (val.get().toString());
            else if ("memberUid".equals(key)) {
                NamingEnumeration<String> vals = (NamingEnumeration<String>) val.getAll();

                this.memberUid = (Collections.list(vals));
            } else if ("gidNumber".equals(key)) this.gidNumber = (val.get().toString());
        }
    }

    /**
     * 含有成员
     */
    public boolean hahMember(String member) {
        if (memberUid == null) return false;

        return memberUid.contains(member);
    }
}
