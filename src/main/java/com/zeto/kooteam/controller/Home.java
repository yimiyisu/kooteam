package com.zeto.kooteam.controller;

import com.blade.kit.EncryptKit;
import com.blade.mvc.http.Cookie;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.ZenUserHelper;
import com.zeto.annotation.AccessRole;
import com.zeto.annotation.MethodType;
import com.zeto.domain.ZenMethod;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;
import lombok.extern.slf4j.Slf4j;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@AccessRole(ZenRole.NORMAL)
public class Home {
    // 退出系统
    public ZenResult quit() {
        List<Cookie> newCookie = new ArrayList<>();
        Cookie cookie = new Cookie();
        cookie.name("uid");
        cookie.value("");
        cookie.maxAge(-1);
        newCookie.add(cookie);
        return ZenResult.success().setCookies(newCookie);
    }

    @MethodType(ZenMethod.ALL)
    public ZenResult test() {
        String date = EncryptKit.md5("4896660667076348");
        return ZenResult.success().setData(date);
    }

    public ZenResult nick(ZenData data) {
        String uid = data.get("uid");
        ZenUser user = ZenUserHelper.i().get(uid);
        if (user == null) {
            return ZenResult.success().put("nick", "");
        }
        return ZenResult.success().put("nick", user.getNick());
    }
}
