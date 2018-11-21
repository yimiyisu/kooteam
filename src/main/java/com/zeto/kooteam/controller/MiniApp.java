package com.zeto.kooteam.controller;

import com.zeto.ZenData;
import com.zeto.ZenResult;
import com.zeto.annotation.AccessRole;

@AccessRole
public class MiniApp {
    public ZenResult test(ZenData data) {
        return ZenResult.success();
    }
}
