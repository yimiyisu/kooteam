package com.yimiyisu.kooteam.hooks.ladp;

import com.yimiyisu.kooteam.hooks.ladp.entity.LdapEntry;
import com.yimiyisu.kooteam.hooks.ladp.entity.LdapGroup;
import com.yimiyisu.kooteam.hooks.ladp.entity.LdapPerson;
import com.yimiyisu.kooteam.hooks.ladp.exception.IllegalConfigException;
import com.yimiyisu.kooteam.hooks.ladp.exception.IllegalGroupException;
import com.yimiyisu.kooteam.hooks.ladp.exception.IllegalPaaswordException;
import com.yimiyisu.kooteam.hooks.ladp.exception.IllegalPersonException;
import com.zen.kit.StringKit;

import javax.naming.NamingEnumeration;
import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import javax.naming.directory.DirContext;
import javax.naming.directory.SearchControls;
import javax.naming.directory.SearchResult;
import javax.naming.ldap.LdapContext;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

/**
 * Ldap 会话默认实现
 *
 * @author noear
 * @since 1.0
 */
public class LdapSessionDefault implements LdapSession {
    private LdapContext context;
    private LdapClient client;

    protected LdapSessionDefault(LdapClient client, LdapContext context) {
        this.client = client;
        this.context = context;
    }

    /**
     * 关闭连接
     */
    @Override
    public void close() throws IOException {
        if (context != null) try {
            context.close();
        } catch (NamingException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * 查找一个人
     *
     * @param userName 人名（由格式符决定使用什么字段，建议用CN）
     */
    @Override
    public LdapPerson findPersonOne(String userName) throws NamingException {
        if (StringKit.isEmpty(userName)) throw new IllegalArgumentException("userName");

        String condition = null;
        if (userName.contains("=")) condition = userName;
        else {
            if (client.getUserFilter() == null) throw new IllegalConfigException("userFilter");

            condition = String.format(client.getUserFilter(), userName);
        }

        return findOneBy("inetOrgPerson", condition, LdapPerson.class);
    }

    /**
     * 查找一个人
     *
     * @param userName     人名（由格式符决定使用什么字段，建议用CN）
     * @param userPassword 人密码
     */
    @Override
    public LdapPerson findPersonOne(String userName, String userPassword) throws NamingException {
        LdapPerson user = findPersonOne(userName);

        if (user != null) if (user.verifyPassword(userPassword)) return user;

        return null;
    }

    /**
     * 查找一个组里的所有用户
     *
     * @param groupName 组名（由格式符决定使用什么字段，建议用CN）
     */
    @Override
    public List<LdapPerson> findPersonList(String groupName) throws NamingException {
        LdapGroup group = findGroupOne(groupName);

        if (group == null) return new ArrayList<>();
        else return findListBy("inetOrgPerson", "gidNumber=" + group.getGidNumber(), LdapPerson.class);
    }

    /**
     * 移除一个人
     *
     * @param userName 人名（由格式符决定使用什么字段，建议用CN）
     */
    @Override
    public void deletePerson(String userName) throws NamingException {
        LdapPerson person = findPersonOne(userName);

        if (person != null) delete(person.getDn());
    }

    /**
     * 创建一个人
     *
     * @param groupName 组名（由格式符决定使用什么字段，建议用CN）
     * @param person    人实体信息
     */
    @Override
    public void createPerson(String groupName, LdapPerson person) throws NamingException {
        LdapGroup group = findGroupOne(groupName);
        if (group == null) throw new IllegalGroupException("groupName: " + groupName);

        person.prepare();
        person.setGidNumber(group.getGidNumber());

        StringBuilder dn = new StringBuilder();
        dn.append("cn=").append(person.getCn()).append(",").append(group.getDn());

        create(dn.toString(), person.getAttributes());
    }

    /**
     * 修改一个人
     *
     * @param person 人实体信息
     */
    @Override
    public void updatePerson(LdapPerson person) throws NamingException {
        if (person.getDn() == null) throw new IllegalArgumentException("person");

        update(person.getDn(), person.getAttributes());
    }

    /**
     * 更新人的密码
     *
     * @param userName        人名（由格式符决定使用什么字段，建议用CN）
     * @param userPasswordOld 旧密码
     * @param userPasswordNew 新密码
     */
    @Override
    public void updatePersonPassword(String userName, String userPasswordOld, String userPasswordNew) throws NamingException {
        LdapPerson user = findPersonOne(userName);
        if (user == null) throw new IllegalPersonException("userName: " + userName);

        if (user.verifyPassword(userPasswordOld) == false) throw new IllegalPaaswordException("userPasswordOld");


        user.setUserPassword(userPasswordNew);

        update(user.getDn(), user.getAttributes());
    }

    /**
     * 查找一个组
     *
     * @param groupName 组的名字
     */
    @Override
    public LdapGroup findGroupOne(String groupName) throws NamingException {
        String groupCondition = null;
        if (groupName.contains("=")) groupCondition = groupName;
        else {
            if (client.getGroupFilter() == null) throw new IllegalConfigException("groupFilter");

            if (client.getGroupFilter().contains("%s") == false) throw new IllegalConfigException("groupFilter");

            groupCondition = String.format(client.getGroupFilter(), groupName);
        }

        return findOneBy("posixGroup", groupCondition, LdapGroup.class);
    }

    /**
     * 查找所有组
     */
    @Override
    public List<LdapGroup> findGroupListAll() throws NamingException {
        return findListBy("posixGroup", null, LdapGroup.class);
    }

    /**
     * 查找节点
     *
     * @param objectClass 对象类型
     * @param condition   条件
     * @param tClass      对象实体类
     */
    @Override
    public <T extends LdapEntry> T findOneBy(String objectClass, String condition, Class<T> tClass) throws NamingException {
        if (StringKit.isEmpty(objectClass)) throw new IllegalArgumentException("objectClass");

        if (StringKit.isEmpty(condition)) throw new IllegalArgumentException("condition");

        //组装过滤条件
        StringBuilder filter = new StringBuilder();
        filter.append("(&(objectClass=")
                .append(objectClass)
                .append(")")
                .append("(")
                .append(condition)
                .append("))");

        return findOne(filter.toString(), tClass);
    }

    /**
     * 查找单节点
     *
     * @param filter 过滤条件
     * @param tClass 对象实体类型
     */
    @Override
    public <T extends LdapEntry> T findOne(String filter, Class<T> tClass) throws NamingException {
        if (StringKit.isEmpty(filter)) throw new IllegalArgumentException("filter");

        if (tClass == null) throw new IllegalArgumentException("tClass");

        NamingEnumeration<SearchResult> result = searchDo(filter);

        while (result.hasMore()) {
            T node = newInstanceDo(tClass);
            node.bind(result.next());

            if (node.getCn() != null) return node;
        }

        return null;
    }

    /**
     * 查询节点列表
     *
     * @param objectClass 对象类型
     * @param condition   条件
     * @param tClass      对象实体类
     */
    @Override
    public <T extends LdapEntry> List<T> findListBy(String objectClass, String condition, Class<T> tClass) throws NamingException {
        if (StringKit.isEmpty(objectClass)) throw new IllegalArgumentException("objectClass");

        //组装过滤条件
        StringBuilder filter = new StringBuilder();

        filter.append("(");

        filter.append("&(objectClass=")
                .append(objectClass)
                .append(")");


        if (StringKit.isNotEmpty(condition)) filter.append("(")
                .append(condition)
                .append(")");

        filter.append(")");

        return findList(filter.toString(), tClass);
    }

    /**
     * 查找节点列表
     *
     * @param filter 过滤条件
     * @param tClass 对象实体类型
     */
    @Override
    public <T extends LdapEntry> List<T> findList(String filter, Class<T> tClass) throws NamingException {
        if (StringKit.isEmpty(filter)) throw new IllegalArgumentException("filter");

        if (tClass == null) throw new IllegalArgumentException("tClass");

        List<T> tList = new ArrayList<>();
        NamingEnumeration<SearchResult> result = searchDo(filter);

        while (result.hasMore()) {
            T node = newInstanceDo(tClass);
            node.bind(result.next());

            if (node.getCn() != null) tList.add(node);
        }

        return tList;
    }

    @Override
    public void create(String dn, Attributes attributes) throws NamingException {
        if (StringKit.isEmpty(dn)) throw new IllegalArgumentException("dn");

        if (attributes == null) throw new IllegalArgumentException("attributes");

        context.createSubcontext(dn, attributes);
    }

    @Override
    public void update(String dn, Attributes attributes) throws NamingException {
        if (StringKit.isEmpty(dn)) throw new IllegalArgumentException("dn");

        if (attributes == null) throw new IllegalArgumentException("attributes");

        context.modifyAttributes(dn, DirContext.REPLACE_ATTRIBUTE, attributes);
    }

    @Override
    public void delete(String dn) throws NamingException {
        if (StringKit.isEmpty(dn)) throw new IllegalArgumentException("dn");

        context.destroySubcontext(dn);
    }

    private <T> T newInstanceDo(Class<T> tClass) {
        try {
            return tClass.newInstance();
        } catch (ReflectiveOperationException e) {
            throw new RuntimeException(e);
        }
    }

    private NamingEnumeration<SearchResult> searchDo(String filter) throws NamingException {
        SearchControls searchControls = new SearchControls();

        //搜索范围:: 0 表示收索命名对象; 1 表示搜索一级命名对象; 2 表示搜索以命名对象为根的整棵子树
        searchControls.setSearchScope(SearchControls.SUBTREE_SCOPE);

        return context.search(client.getBaseDn(), filter, searchControls);
    }
}