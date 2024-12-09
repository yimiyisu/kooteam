package com.yimiyisu.kooteam.hooks.note;

import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("put/note")
public class PutHook implements IHook {
    @Inject
    private ZenEngine zenEngine;

    @Override
    public void after(ZenData data, ZenResult result) {
        data.put("noteId", result.get("id")).
                put("type", "9").
                put("uid", data.getUid()).
                refresh();
        zenEngine.execute("put/note_user", data);
    }
}
