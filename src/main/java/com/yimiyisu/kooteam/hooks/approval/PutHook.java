package com.yimiyisu.kooteam.hooks.approval;

import com.zen.ZenData;
import com.zen.ZenEngine;
import com.zen.ZenResult;
import com.zen.annotation.Inject;
import com.zen.annotation.ZenHook;
import com.zen.interfaces.IHook;

@ZenHook("put/approval")
public class PutHook implements IHook {
    @Inject
    private ZenEngine zenEngine;

    @Override
    public void after(ZenData data,ZenResult zenResult){
        ZenData zenData = ZenData.create().put("approvalId",zenResult.get("id"));
        zenData.put("title",data.get("title"));
        ZenResult nodeResult = zenEngine.execute("put/approval_node",zenData);
    }
}
