package com.yimiyisu.kooteam;

import com.zen.ZenData;
import com.zen.ZenResult;
import com.zen.interfaces.IWebsocketHandle;

public class WebsocketHandle implements IWebsocketHandle {

    @Override
    public ZenResult excute(String type, ZenData data) {
        return ZenResult.success().setData("websocket:" + type);
    }
}
