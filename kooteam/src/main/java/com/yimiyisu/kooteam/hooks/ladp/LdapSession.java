package com.yimiyisu.kooteam.hooks.ladp;


import com.yimiyisu.kooteam.hooks.ladp.entity.LdapEntry;
import com.yimiyisu.kooteam.hooks.ladp.entity.LdapGroup;
import com.yimiyisu.kooteam.hooks.ladp.entity.LdapPerson;

import javax.naming.NamingException;
import javax.naming.directory.Attributes;
import java.io.Closeable;
import java.util.List;

/**
 * Ldap 会话
 *
 * @author noear
 * @since 1.0
 */
public interface LdapSession extends Closeable {

    /**
     * 查找一个人
     *
     * @param userName 人名（由格式符决定使用什么字段，建议用CN）
     */
    LdapPerson findPersonOne(String userName) throws NamingException;

    /**
     * 查找一个人
     *
     * @param userName     人名（由格式符决定使用什么字段，建议用CN）
     * @param userPassword 人密码
     */
    LdapPerson findPersonOne(String userName, String userPassword) throws NamingException;

    /**
     * 查找一个组里的所有用户
     *
     * @param groupName 组名（由格式符决定使用什么字段，建议用CN）
     */
    List<LdapPerson> findPersonList(String groupName) throws NamingException;

    /**
     * 移除一个人
     *
     * @param userName 人名（由格式符决定使用什么字段，建议用CN）
     */
    void deletePerson(String userName) throws NamingException;

    /**
     * 创建一个人
     *
     * @param groupName 组名（由格式符决定使用什么字段，建议用CN）
     * @param person    人实体信息
     */
    void createPerson(String groupName, LdapPerson person) throws NamingException;

    /**
     * 修改一个人
     *
     * @param person 人实体信息
     */
    void updatePerson(LdapPerson person) throws NamingException;

    /**
     * 更新人的密码
     *
     * @param userName        人名（由格式符决定使用什么字段，建议用CN）
     * @param userPasswordOld 旧密码
     * @param userPasswordNew 新密码
     */
    void updatePersonPassword(String userName, String userPasswordOld, String userPasswordNew) throws NamingException;

    /**
     * 查找一个组
     *
     * @param groupName 组的名字
     */
    LdapGroup findGroupOne(String groupName) throws NamingException;


    /**
     * 查找所有组
     */
    List<LdapGroup> findGroupListAll() throws NamingException;


    /**
     * 查找节点
     *
     * @param objectClass 对象类型
     * @param condition   条件
     * @param tClass      对象实体类
     */
    <T extends LdapEntry> T findOneBy(String objectClass, String condition, Class<T> tClass) throws NamingException;

    /**
     * 查找单节点
     *
     * @param filter 过滤条件
     * @param tClass 对象实体类型
     */
    <T extends LdapEntry> T findOne(String filter, Class<T> tClass) throws NamingException;

    /**
     * 查询节点列表
     *
     * @param objectClass 对象类型
     * @param condition   条件
     * @param tClass      对象实体类
     */
    <T extends LdapEntry> List<T> findListBy(String objectClass, String condition, Class<T> tClass) throws NamingException;

    /**
     * 查询节点列表
     *
     * @param filter 过滤条件
     * @param tClass 对象实体类型
     */
    <T extends LdapEntry> List<T> findList(String filter, Class<T> tClass) throws NamingException;

    /**
     * 创建一个节点
     *
     * @param dn         节点DN
     * @param attributes 节点属性
     */
    void create(String dn, Attributes attributes) throws NamingException;

    /**
     * 更新一个节点
     *
     * @param dn         节点DN
     * @param attributes 节点属性
     */
    void update(String dn, Attributes attributes) throws NamingException;

    /**
     * 删除一个节点
     *
     * @param dn 节点DN
     */
    void delete(String dn) throws NamingException;
}
