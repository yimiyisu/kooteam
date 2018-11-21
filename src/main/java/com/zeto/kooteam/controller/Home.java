package com.zeto.kooteam.controller;

import com.blade.mvc.http.Cookie;
import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;
import com.zeto.dal.UserMapper;
import com.zeto.domain.ZenRole;
import com.zeto.domain.ZenUser;

import java.util.ArrayList;
import java.util.List;

@AccessRole(ZenRole.NORMAL)
public class Home {
    // 退出网页
    public ZenResult quit() {
        List<Cookie> newCookie = new ArrayList<>();
        Cookie cookie = new Cookie();
        cookie.name("uid");
        cookie.value("");
        cookie.maxAge(-1);
        newCookie.add(cookie);
        return ZenResult.success().setCookies(newCookie);
    }

    public ZenResult nick(ZenData data) {
        String uid = data.get("uid");
        ZenUser user = UserMapper.i().get(uid);
        if (user == null) {
            return ZenResult.success().put("nick", "");
        }
        return ZenResult.success().put("nick", user.getNick());
    }
}
