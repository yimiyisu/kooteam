package com.yimiyisu.kooteam.controller;

import com.zen.ZenController;
import com.zen.ZenResult;
import com.zen.annotation.AccessRole;
import com.zen.annotation.MethodType;
import com.zen.enums.ZenAction;
import com.zen.enums.ZenMethod;
import com.zen.enums.ZenRole;

@AccessRole(ZenRole.ANONYMITY)
public class OAuth extends ZenController {
    @MethodType(ZenMethod.GET)
    public ZenResult create() {
        return ZenResult.success().setAction(ZenAction.REDIRECT);
    }

    @MethodType(ZenMethod.GET)
    public ZenResult callback() {
        return ZenResult.success();
    }
}
