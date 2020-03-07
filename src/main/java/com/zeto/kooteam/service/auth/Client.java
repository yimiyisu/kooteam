package com.zeto.kooteam.service.auth;

import com.zeto.ZenResult;
import com.zeto.domain.ZenUser;

public interface Client {
    void init(String key);

    ZenResult params(String checkId);

    ZenUser getUser(String code);

    void updateUser(String unionId);
}
