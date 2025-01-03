package com.yimiyisu.kooteam.hooks.note;

import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("delete/note_user")
public class DeleteHook implements IHook {
    @Override
    public ZenResult before(ZenData data) {
        if (!data.contains("uid")) data.put("uid", data.getUid());
        // 进行权限校验
        return IHook.super.before(data);
    }

    @Override
    public void after(ZenData data, ZenResult result) {
        IHook.super.after(data, result);
    }
}
