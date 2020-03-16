package com.zeto.kooteam.service.auth;

import com.blade.Blade;
import com.blade.ioc.annotation.Bean;
import com.blade.ioc.annotation.Inject;
import com.blade.ioc.annotation.Order;
import com.blade.loader.BladeLoader;
import com.zeto.ZenEnvironment;
import com.zeto.ZenResult;
import com.zeto.domain.ZenAction;
import com.zeto.domain.ZenUser;
import com.zeto.kit.ConfigKit;
import com.zeto.kooteam.service.auth.ding.DingClient;
import com.zeto.kooteam.service.auth.domain.ClientType;
import com.zeto.kooteam.service.auth.wechat.WechatClient;

@Order(1)
@Bean
public class AuthService implements BladeLoader {
    @Inject
    private WechatClient wechatClient;

    @Inject
    private DingClient dingClient;

    @Inject
    private LADPService ldapService;

    private Client client = null;
    private String TYPE = null;
    private final static String configKey = "account";


    @Override
    public void load(Blade blade) {
        this.init();
    }

    // 初始化系统配置文件
    public void init() {
        if (ZenEnvironment.isMulti()) {
            TYPE = "cloud";
            return;
        }
        if (ZenEnvironment.isNoSetup()) {
            return;
        }
        String type = ConfigKit.get(configKey, "type");
        if (ClientType.Wechat.equals(type)) {
            client = this.wechatClient;
            TYPE = "dingding";
        }
        if (ClientType.DingDing.equals(type)) {
            client = this.dingClient;
            TYPE = "wechat";
        }
        if (ClientType.LADP.equals(type)) {
            ldapService.init(configKey);
            TYPE = "ladp";
            return;
        }
        if (client != null) {
            client.init(configKey);
        }
    }

    // 获取系统登录类型
    public String type() {
        return TYPE;
    }

    public ZenResult params(String checkId) {
        if (client == null) {
            return ZenResult.success().put("type", TYPE).setAction(ZenAction.SILENT);
        }
        return client.params(checkId).put("type", TYPE).setAction(ZenAction.SILENT);
    }

    public void updateProfile(String unionId) {
        client.updateUser(unionId);
    }

    // 根据第三方授权Code获取用户详细信息
    public ZenUser getUser(String code) {
        return client.getUser(code);
    }
}
