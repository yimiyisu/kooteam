package com.yimiyisu.kooteam.hooks.ladp;


import com.yimiyisu.kooteam.hooks.ladp.entity.LdapPerson;
import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.annotation.ZenHook;
import com.zen.domain.ZenUser;
import com.zen.enums.UserBasicTag;
import com.zen.enums.ZenAction;
import com.zen.enums.ZenRole;
import com.zen.interfaces.IHook;
import com.zen.kit.ConfigKit;
import com.zen.kit.StringKit;
import com.zen.kit.UserKit;
import lombok.extern.slf4j.Slf4j;

import javax.naming.NamingException;
import java.io.IOException;

@Slf4j
@ZenHook("loginHook")
public class LadpHook implements IHook {
    private static final String LADP = "ladp";
    private final static String FORBIDDEN = "已被禁止登陆";
    private LdapClient ldapClient = null;

    @Override
    public ZenResult before(ZenData data) {
        String channel = ConfigKit.get("loginMode");
        if (!LADP.equals(channel)) {
            return null;
        }
        String username = data.get("username"), password = data.get("password");
        if (ldapClient == null) ldapClient = new LdapClient();
        try (LdapSession session = ldapClient.open()) {
            LdapPerson person = session.findPersonOne(username);
            if (person == null) {
                return ZenResult.fail("用户不存在");
            }
            if (!person.verifyPassword(password)) {
                return ZenResult.fail("用户密码不对");
            }
            ZenUser user = UserKit.getByName(username);
            if (user == null) {
                String nick = person.getGivenName();
                if (StringKit.isEmpty(nick)) {
                    nick = username;
                }
                user = new ZenUser();
                user.setId(StringKit.objectId());
                user.setNick(nick);
                user.setEmail(person.getMail());
                user.setMobile(person.getMobile());
                user.setRole(ZenRole.CONSOLE);
                UserKit.insert(user);
            } else if (user.hasTag(UserBasicTag.FORBIDDEN)) return ZenResult.fail(FORBIDDEN);

            String token = UserKit.createToken(user.getId());
            return ZenResult.success().setData(token).setAction(ZenAction.END);
        } catch (NamingException | IOException e) {
            log.error("ladp error", e);
            return ZenResult.fail("LADP登录失败");
        }
    }
}
